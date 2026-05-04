# Projeto Integrador - Repositório para estudantes do Piaget 📚
Licenciatura em Engenharia Informática do Instituto Piaget 25/26

O REP é uma plataforma académica desenvolvida para os alunos dos cursos tecnológicos do instituto Piaget (Almada), com o objetivo de centralizar materiais de estudo, feedback de disciplinas e apoio ao estudo através de Inteligência Artificial.

## 🧠 Objetivos
- Facilitar o acesso a materias académicos (resumos, exames e apontamentos) através de upload e dowload de ficheiros
- Permitir aos alunos dar e consultar feedback sobre as respetivas disciplinas
- Com a integração de um chat bot, ajudar os alunos a estudar e realizar quiz's com base nos materiais carregados na própria disciplina

## </> Tecnologias utilizadas
- **Frontend** Next.js, TypeScript, Tailwind CSS 
- **Backend** Next.js API Routes
- **Base de dados** Supabase (PostgreSQL)
- **Chat Bot** OpenAI API
  
## ⚙️ Setup e Instalação Local
Para correres o projeto localmente com todas as dependências necessárias, segue os passos abaixo.

### 1. Pré-requisitos
Certifica-te de que tens instalado na tua máquina:
- [Node.js](https://nodejs.org/) (versão 18.17 ou superior)
- [Git](https://git-scm.com/)

### 2. Clonar o Repositório
Abre o terminal e faz o clone do projeto para a tua máquina:
```bash
git clone https://github.com/RafaelRebelo99/Rep_Piaget.git
cd rep_piaget
```

### 3. Instalar as Dependências
O projeto já tem tudo configurado no `package.json`. Basta executares o comando abaixo e o NPM vai instalar todo o ecossistema:
```bash
npm install
```

### 4. Configurar as Variáveis (Supabase API)
Para que a aplicação consiga comunicar com a base de dados e com a autenticação do Supabase, precisas de configurar as tuas chaves de API locais.

1. Duplica o ficheiro de template das variáveis de ambiente criando o teu ficheiro local:
   ```bash
   cp .env.example .env.local
   ```
2. Vai ao Dashboard do Supabase, seleciona o projeto e navega para **Project Settings > API**.
3. Copia os valores de **Project URL** e **anon public key**.
4. Abre o ficheiro `.env.local` e preenche os respetivos valores:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://teu-id-de-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tua-chave-anon-public...
   ```
*Aviso de Segurança: O ficheiro `.env.local` está incluído no `.gitignore` e **nunca** deve ser enviado para o GitHub, contém credenciais sensíveis!*

### 5. Executar em Dev Mode
Com as dependências instaladas e as chaves configuradas, podes arrancar o projeto:
```bash
npm run dev
```
Abre http://localhost:3000 no teu browser para ver a aplicação a correr.

## 👥 Equipa 
Built With ❤️ by:
- João Neves
- Rafael Rebelo
- Rodrigo Pires
- Yurma Afonso