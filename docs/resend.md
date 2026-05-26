# Integração de Email (Resend)

O **Rep_Piaget** utiliza o [Resend](https://resend.com/) para a gestão de emails transacionais, servindo como o canal principal de comunicação entre os alunos e a equipa de suporte técnico da plataforma.

---

## Arquitetura do Serviço

A funcionalidade de suporte é implementada de forma segura através de uma **API Route (Server-side)**. Esta abordagem garante que as credenciais sensíveis do serviço (API Keys) nunca sejam expostas no lado do cliente (Frontend), protegendo a infraestrutura contra utilizações indevidas.

### Fluxo de Comunicação
1.  **Submissão:** O utilizador preenche e envia o formulário de suporte na interface.
2.  **Pedido:** O cliente dispara um pedido `POST` para a rota interna `/api/suporte`.
3.  **Processamento:** O servidor valida os dados e utiliza o SDK oficial do **Resend** para autenticar e despachar a mensagem.
4.  **Entrega:** O email é entregue na caixa de correio central do projeto (`rep_suporte@outlook.pt`).

---

## Detalhes da API

**Localização:** `src/app/api/suporte/route.ts`

O serviço processa um objeto JSON com a seguinte estrutura de dados obrigatória:

* **`nome`**: Identificação do remetente para personalização do contacto.
* **`email`**: Endereço de contacto do aluno (configurado como *reply-to*).
* **`assunto`**: Título sumário que categoriza a prioridade ou tema do pedido.
* **`descricao`**: Corpo detalhado da mensagem com o problema ou dúvida.

A integração utiliza o método `resend.emails.send()`, injetando estes dados num template HTML formatado para garantir uma leitura clara e organizada por parte da equipa de administração.

---

## Configuração de Ambiente

Para a comunicação com a infraestrutura do Resend, é necessária a configuração da seguinte variável de ambiente no ficheiro local:

### Variáveis Necessárias (`.env.local`)
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx