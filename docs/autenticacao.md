# Autenticação (Registo e Login)

O sistema de autenticação do **REP Piaget** é gerido de forma centralizada através do **Supabase Auth**. Este serviço encarrega-se de gerir as credenciais de forma altamente segura e fornecer *tokens* de sessão (JWT) que a aplicação Next.js consome para proteger rotas e validar acessos na base de dados.

## 1. Fluxo de Registo (Sign Up)

Quando um novo aluno tenta criar conta na plataforma, ocorrem os seguintes passos:
1. **Criação de Credenciais:** O email, nome e a password submetidos são enviados para o Supabase Auth.
2. **Tabela de Profiles:** Após a autenticação bem-sucedida, existe um mecanismo que garante a criação e sincronização de um perfil associado na tabela `profiles` (ou similar) da base de dados PostgreSQL. Isto permite associar facilmente informação de utilizador (ex: comentários e votos) ao ID da autenticação.
3. **Definição de Permissões (Role):** Por norma, os novos utilizadores recebem a role de aluno (`USER`) de forma predefinida na base de dados. Perfis de administração (`ADMIN`) devem ser promovidos manualmente na DB para garantirmos a integridade do repositório.

## 2. Fluxo de Login (Sign In)

O processo de login permite que os alunos com contas já registadas retomem as suas sessões na plataforma:
1. O utilizador submete o email e a password no formulário de Login.
2. O cliente do Supabase valida a informação e retorna uma **Sessão** (que inclui o `access_token` e os dados do utilizador).
3. Esta sessão é guardada persistentemente na aplicação (usualmente via Cookies num contexto de *App Router* em Next.js), o que permite ao utilizador fechar o browser e continuar com o login feito posteriormente.

## 3. Gestão de Sessão e Interface (UI)

Para garantir que o layout (como a *Navbar* e a *Sidebar*) reagem instantaneamente a alterações no estado da sessão:
- **Ocultação de Funcionalidades:** A aplicação valida a existência da sessão ativa nos diferentes componentes. Caso o utilizador não tenha feito login, componentes cruciais não vão ser exibidos ou redirecionar o utilizador para a página de Login.
- **Sincronização de Estado:** Qualquer modificação ao estado da autenticação aciona recálculos visuais de modo atualizar os menus.

## 4. Proteção de Rotas e Base de Dados

Para além da validação visual na interface, a segurança baseia-se em mecanismos ao nível do Servidor e da Base de Dados:
- **Next.js Middleware:** Funciona como um escudo no lado do servidor. Se um utilizador não autenticado tentar aceder forçosamente através de URL a rotas privadas, o Middleware interceta esse pedido e redireciona automaticamente para `/login`.
- **Row Level Security (RLS):** No Supabase, o simples facto de submeter um pedido POST para inserir algo na base de dados requer a passagem do token do utilizador. As tabelas estão protegidas para que apenas os autores originais ou administradores possam apagar os ficheiros submetidos, prevenindo interferências externas perigosas.
