# Estrutura da Base de Dados (Supabase)

O **Rep_Piaget** utiliza o PostgreSQL como motor relacional, gerido através da plataforma [Supabase](https://supabase.com/). O esquema foi desenhado para ser escalável, seguro e otimizado para a gestão de materiais académicos e interação entre utilizadores.

---

## Domínios de Dados

As tabelas estão organizadas em domínios lógicos para facilitar a manutenção e garantir a integridade referencial do sistema:

### 1. Identidade e Acesso
* **`profiles`**: Extensão dos utilizadores do *Supabase Auth*. Armazena metadados como nome, email, nível de acesso (`role`: USER/ADMIN) e a `ai_quota` para controlo de utilização do assistente.
* **`audit_logs`**: Registo histórico de ações administrativas, essencial para fins de segurança e auditoria interna.

### 2. Estrutura Académica
* **`courses`**: Catálogo central de licenciaturas e CTeSPs.
* **`disciplines`**: Repositório de todas as unidades curriculares.
* **`course_disciplines`**: Tabela de junção que mapeia a relação entre disciplinas e cursos, definindo especificamente o ano e o semestre de cada ocorrência.

### 3. Repositório de Materiais
* **`materials`**: Centraliza os metadados dos ficheiros submetidos (PDF, DOCX, ZIP). Inclui o sistema de moderação através do campo `status` (`VISIBLE` ou `HIDDEN`).
* **`material_categories`**: Define a tipologia dos ficheiros, permitindo filtrar por Exames, Resumos ou Exercícios.

### 4. Interação Social
* **`votes`**: Registo de pontuações (*Upvotes* e *Downvotes*), utilizado para calcular a relevância e qualidade dos materiais.
* **`favorites`**: Permite que cada utilizador crie uma biblioteca pessoal de materiais para acesso rápido.
* **`feedbacks`**: Espaço dedicado à avaliação qualitativa das disciplinas (classificação numérica e comentários).

### 5. Assistente de IA
* **`chat_sessions`**: Instâncias de conversação isoladas por utilizador e por disciplina.
* **`chat_messages`**: Histórico detalhado de interações com o modelo de linguagem (LLM).

---

## Segurança (Row Level Security - RLS)

A segurança da informação é aplicada diretamente na camada de base de dados através de políticas de **RLS**, garantindo que:

1.  **Visibilidade:** Apenas utilizadores autenticados podem aceder a materiais com estado `VISIBLE`.
2.  **Propriedade:** Os utilizadores têm permissão de edição ou eliminação estritamente sobre os seus próprios perfis, submissões e outros dados que criam.
3.  **Administração:** Apenas perfis com a `role` 'ADMIN' possuem privilégios para gerir logs de auditoria e moderar conteúdos de terceiros.

---

## Otimizações via Views

Para reduzir a complexidade das consultas no frontend e melhorar a performance, utilizamos as seguintes vistas:
* **`vw_course_structure`**: Consolida a hierarquia académica, expondo a relação curso-disciplina-semestre de forma direta (Exemplo de otimização).
* **`vw_materials_detailed`**: Agrega dados de múltiplas tabelas para devolver o `score` total, nome do autor e categoria num único pedido.

---

Aqui está o texto com a segunda função formatada corretamente para manter a consistência visual com a primeira:

## Automação e Integridade

O sistema tira partido de **Triggers** e **Functions** nativos do PostgreSQL para automatizar processos críticos:

> ### **handle_new_user()**
> Esta função é disparada automaticamente após um novo registo no *Supabase Auth*. O trigger assegura a criação imediata de uma entrada correspondente na tabela `public.profiles`, garantindo que o utilizador tem um perfil funcional desde o primeiro segundo de acesso à plataforma.

> ### **check_material_score_and_hide()**
> Este trigger é executado sempre que um voto é inserido, atualizado ou removido na tabela `public.votes`. A função recalcula o score total do material afetado e, caso a pontuação atinja um limiar negativo de -5, altera automaticamente o status do material para `HIDDEN`. Se a pontuação subir acima desse limiar, o estado é revertido para `VISIBLE`. Este mecanismo serve como um sistema de moderação automática, removendo de circulação conteúdos que a comunidade considera de baixa qualidade.