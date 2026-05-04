------------------------------------------------------------
-- 1. TABELA: profiles
-- Descrição: Dados públicos dos utilizadores ligados ao Auth
------------------------------------------------------------
create table public.profiles (
  id uuid references auth.users(id) on delete cascade on update cascade not null primary key,
  created_at timestamptz default now(),
  email text unique,
  full_name text,
  role text default 'USER' check (role in ('ADMIN', 'USER')),
  can_upload boolean default true,
  ai_message_quota bigint default 10,
  ai_private_api text default null
);

------------------------------------------------------------
-- 2. TABELA: courses
-- Descrição: Lista de licenciaturas e CTeSPs
------------------------------------------------------------
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  type text check (type in ('LICENCIATURA', 'CTESP')) not null default 'LICENCIATURA',
  description text,
  campus text default 'Almada'
);

------------------------------------------------------------
-- 3. TABELA: material_categories
------------------------------------------------------------
create table public.material_categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null
);

------------------------------------------------------------
-- 4. TABELA: disciplines
------------------------------------------------------------
create table public.disciplines (
  id uuid default gen_random_uuid() primary key,
  name text not null
);

-- Tabela de junção (visto que uma UC pode pertencer a vários cursos/anos)
create table public.course_disciplines (
  course_id uuid references public.courses(id) on delete cascade,
  discipline_id uuid references public.disciplines(id) on delete cascade,
  year int check (year between 1 and 3),
  semester int check (semester between 1 and 2),
  primary key (course_id, discipline_id)
);

------------------------------------------------------------
-- 5. TABELA: materials
------------------------------------------------------------
create table public.materials (
  id uuid default gen_random_uuid() primary key,
  discipline_id uuid references public.disciplines(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.material_categories(id) on delete set null,
  title text not null,
  description text,
  file_path text not null, -- Ex: [ID_DISCIPLINA]/[TIMESTAMP]-nome.pdf
  file_type text not null, -- Ex: PDF, DOCX, ZIP
  status text check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'PENDING',
  created_at timestamptz default now()
);

------------------------------------------------------------
-- 6. TABELAS DE INTERAÇÃO
------------------------------------------------------------
create table public.votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  material_id uuid references public.materials(id) on delete cascade,
  value int check (value in (-1, 0, 1)),
  unique(user_id, material_id)
);

create table public.favorites (
  user_id uuid references public.profiles(id) on delete cascade,
  material_id uuid references public.materials(id) on delete cascade,
  primary key (user_id, material_id)
);

create table public.feedbacks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  discipline_id uuid references public.disciplines(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  is_anonymous boolean default false,
  created_at timestamptz default now()
);

------------------------------------------------------------
-- 7. TABELAS DE CHAT (IA) E AUDITORIA
------------------------------------------------------------
create table public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  discipline_id uuid references public.disciplines(id) on delete cascade,
  created_at timestamptz default now()
);

create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references public.profiles(id),
  action text not null,
  created_at timestamptz default now()
);

------------------------------------------------------------
-- 8. VIEW DETALHADA 
------------------------------------------------------------
create or replace view public.vw_materials_detailed as
select 
    m.id as material_id,
    m.title,
    m.description,
    m.file_path,
    m.file_type,
    m.status,
    m.created_at,
    p.full_name as user_name,
    d.name as discipline_name,
    c.name as category_name,
    (select coalesce(sum(value), 0) from public.votes v where v.material_id = m.id) as score
from 
    public.materials m
left join public.profiles p on m.user_id = p.id
left join public.disciplines d on m.discipline_id = d.id
left join public.material_categories c on m.category_id = c.id;

------------------------------------------------------------
-- FUNÇÃO: handle_new_user()
-- Sincroniza metadados do registo para a tabela pública
------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student'), 
    new.email,
    'USER'
  );
  return new;
end;
$$;

------------------------------------------------------------
-- TRIGGER: on_auth_user_created
-- Executa a função após a inserção em auth.users
------------------------------------------------------------
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

------------------------------------------------------------
-- Ativação do RLS para todas as tabelas do esquema public
------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.disciplines enable row level security;
alter table public.materials enable row level security;
alter table public.votes enable row level security;
alter table public.favorites enable row level security;
alter table public.feedbacks enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.audit_logs enable row level security;

------------------------------------------------------------
-- PROMOÇÃO para ADMIN
------------------------------------------------------------
update public.profiles
set role = 'ADMIN'
where email in (
  'admin1@rep.pt',
  'admin2@rep.pt',
  'admin3@rep.pt',
  'admin4@rep.pt'
);
