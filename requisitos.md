
# 📋 Levantamento de Requisitos

## 1. 💡 Introdução
O presente documento descreve o levantamento de requisitos do projeto REP (Repositório
Educativo do Piaget), uma plataforma académica desenvolvida no âmbito do Projeto
Integrador da Licenciatura em Engenharia Informática do Instituto Piaget (Almada), ano letivo
2025/2026.


## 2. 📌 Âmbito do Sistema
A plataforma REP é uma aplicação web acessível a partir de qualquer dispositivo com
browser. O sistema abrange as seguintes áreas funcionais:

• Gestão e partilha de materiais académicos (resumos, apontamentos, exames)

• Sistema de feedback por disciplina

• Chatbot de apoio ao estudo com Inteligência Artificial

• Sistema de quizzes gerados a partir dos materiais carregados

• Autenticação e gestão de utilizadores

• Pesquisa de conteúdos na plataforma

# 🔹 3. Requisitos Funcionais

## 🔹 3.1 Autenticação e Gestão de Utilizadores

• RF01 O sistema deve permitir o registo de novos utilizadores com e-mail e
palavra-passe, Alta

• RF02 O sistema deve permitir o login com e-mail e palavra-passe, Alta

• RF03 O sistema deve suportar login com conta institucional,Média
(Google/OAuth)

• RF04 O sistema deve permitir a recuperação de palavra-passe por e-mail Alta

• RF05 O sistema deve distinguir os perfis: Aluno e Administrador, Alta

• RF06 O administrador deve poder gerir contas (criar, suspender, eliminar) Alta

## 🔹 3.2 Materiais Académicos

• RF07 Os alunos devem poder fazer upload de ficheiros, Alta
(PDF, DOCX, PPTX)

• RF08 Os utilizadores autenticados devem poder fazer download dos materiais disponíveis, Alta

• RF09 Os materiais devem estar organizados por disciplina e tipo (resumo, exame, apontamento), Alta

• RF10 O sistema deve permitir a visualização de metadados do ficheiro, Média
(autor, data, disciplina)

• RF11 O administrador deve poder remover materiais inadequados, Alta

• RF12 O sistema deve limitar o tamanho máximo de ficheiro por upload, Média
(ex: 20 MB)

## 🔹 3.3 Feedback de Disciplinas

• RF13 Os alunos devem poder submeter feedback anónimo sobre as disciplinas, Alta

• RF14 O sistema deve permitir a consulta do feedback agregado por disciplina, Alta

• RF16 O feedback deve incluir classificação numérica e comentário textual Média

• RF17 O sistema deve impedir a submissão de múltiplos feedbacks pelo mesmo utilizador na mesma disciplina, Alta

## 🔹 3.4 Chatbot de Apoio ao Estudo (IA)

• RF18 O sistema deve disponibilizar um chatbot integrado por disciplina, Alta

• RF19 O chatbot deve responder a perguntas com base nos materiais carregados na disciplina, Alta

• RF20 O utilizador deve poder iniciar, continuar e terminar sessões de estudo com o chatbot, Alta

• RF21 O chatbot deve gerar quizzes automáticos com base nos materiais da disciplina, Alta

• RF22 O sistema deve guardar o histórico de conversas por utilizador, Média

• RF23 O chatbot deve indicar a fonte (material) de onde retirou a resposta, Baixa

## 🔹 3.5 Pesquisa de Conteúdos

• RF24 O sistema deve permitir a pesquisa de materiais por nome e disciplina, Alta 

• RF25 Os resultados de pesquisa devem ser filtráveis e ordenáveis, Média

• RF26 A pesquisa deve retornar resultados em tempo real (à medida que o utilizador escreve), Baixa


# 🔹 4. Requisitos Não Funcionais

• RNF01 Desempenho As páginas devem carregar em menos de 3 segundos em ligações normais

• RNF02 Segurança Todas as comunicações devem usar HTTPS

• RNF03 Segurança As palavras-passe devem ser armazenadas com hashing seguro
(gerido pelo Supabase Auth)

• RNF04 Segurança O acesso à API OpenAI deve ser feito exclusivamente pelo
backend, nunca expondo a chave no frontend

• RNF05 Usabilidade A interface deve ser responsiva e utilizável em dispositivos
móveis e desktop

• RNF06 Usabilidade A interface deve seguir princípios de acessibilidade (WCAG 2.1
nível AA)

• RNF07 Disponibilidade A plataforma deve ter disponibilidade mínima de 99% em horário
letivo

• RNF08 Escalabilidade A arquitetura deve suportar crescimento do número de
utilizadores e ficheiros sem refatorização

• RNF09 Manutenibilidade O código deve seguir boas práticas de desenvolvimento
(TypeScript, comentários, estrutura modular)

• RNF10 Privacidade Os dados dos utilizadores devem ser tratados em conformidade
com o RGPD

# 🔹 5. Casos de Uso Principais / Use Cases
Os diagramas de casos de uso serão desenvolvidos em detalhe na documentação UML. A
seguir apresentam-se os casos de uso de alto nível identificados.

• UC01 Registar conta Visitante Nenhuma

• UC02 Autenticar na plataforma Aluno, Professor, Conta registada, Admin

• UC03 Fazer upload de material Aluno, Professor Autenticado

• UC04 Fazer download de material Aluno, Professor Autenticado

• UC05 Submeter feedback Aluno Autenticado, disciplina existente

• UC06 Consultar feedback Professor, Admin Autenticado

• UC07 Interagir com chatbot Aluno Autenticado, materiais carregados

• UC08 Gerar quiz Aluno Autenticado, materiais carregados

• UC09 Pesquisar conteúdos Aluno, Professor Autenticado

• UC10 Gerir utilizadores Admin Autenticado como Admin

• UC11 Gerir disciplinas Admin Autenticado como Admin

# ⚙️ 6. Restrições e Pressupostos

## 🔹 6.1 Restrições Técnicas
• O sistema será desenvolvido em Next.js com TypeScript e Tailwind CSS

• A base de dados e autenticação serão geridas pelo Supabase (PostgreSQL)

• O chatbot utilizará a API da OpenAI (modelo GPT)

• O deployment será feito na plataforma Vercel

## 🔹 6.2 Restrições de Negócio
• O acesso a materiais requer autenticação

• O projeto deve estar concluído no final do ano letivo 2025/2026


## 🔹 6.3 Pressupostos
• Os utilizadores têm acesso a um browser moderno e ligação à internet

• O Instituto Piaget fornecerá os dados das disciplinas e cursos

• A equipa terá acesso às APIs necessárias (Supabase, OpenAI) durante o
desenvolvimento

