# Setup e Instalação Local

Para correres o projeto localmente com todas as dependências necessárias, segue os passos abaixo. Esta secção tem como base a documentação principal do repositório.

## 1. Pré-requisitos
Certifica-te de que tens instalado na tua máquina:
- [Node.js](https://nodejs.org/) (versão 18.17 ou superior)
- [Git](https://git-scm.com/)

## 2. Clonar o Repositório
Abre o terminal e faz o clone do projeto para a tua máquina:
```bash
git clone https://github.com/RafaelRebelo99/Rep_Piaget.git
cd rep_piaget
```

## 3. Instalar as Dependências
O projeto já tem tudo configurado no `package.json`. Basta executares o comando abaixo e o NPM vai instalar todo o ecossistema e as suas bibliotecas dependentes (Tailwind CSS, Supabase, Lucide, etc.):
```bash
npm install
```

## 4. Configurar as Variáveis de Ambiente
Para que a aplicação consiga comunicar com a base de dados, com a autenticação (Supabase) e com o serviço de envio de e-mails (Resend), precisas de configurar as tuas chaves API locais.

1. Duplica o ficheiro de template gerando o teu ficheiro local:
   ```bash
   cp .env.example .env.local
   ```
2. **Configuração Supabase**: Vai ao Dashboard do teu projeto no Supabase, navega para **Project Settings > API**. Copia os valores para o ficheiro `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://teu-id-de-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tua-chave-anon-public...
   ```
3. **Configuração Resend**: Vai ao Dashboard do Resend, cria uma API Key e coloca o valor no ficheiro:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
   ```

> ⚠️ **Aviso de Segurança:** O ficheiro `.env.local` contém credenciais sensíveis e está incluído no `.gitignore`. **Nunca o envies para o GitHub**.

## 5. Executar em Dev Mode
Com as dependências instaladas e as chaves devidamente configuradas, podes arrancar o servidor de desenvolvimento:
```bash
npm run dev
```

Abre http://localhost:3000 no teu browser para veres a aplicação a correr.