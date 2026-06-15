# Painel de Administração

O **Painel de Administração** do **Rep_Piaget** centraliza as ferramentas de gestão, moderação e auditoria da plataforma. Esta área é exclusiva para utilizadores com `role = 'ADMIN'`.

## Controlo de Acesso

Todas as páginas administrativas verificam a sessão do utilizador através do Supabase Auth. Se não existir sessão ativa, o utilizador é redirecionado para `/login`.

Depois da autenticação, é consultada a tabela **`profiles`** para confirmar se o perfil tem permissões administrativas:

```txt
role = 'ADMIN'
```

Utilizadores sem permissões são redirecionados para a página inicial.

## Dashboard Administrativo

A página principal apresenta uma visão geral do sistema através de cartões estatísticos:

* **Total de Utilizadores**: número de contas registadas.
* **Total de Ficheiros**: número total de materiais existentes.
* **Ficheiros Ocultos**: materiais com `status = 'HIDDEN'`.

Os materiais usam os estados **`VISIBLE`** para ficheiros visíveis e **`HIDDEN`** para ficheiros ocultos sujeitos a revisão administrativa.

## Gestão de Utilizadores

Dentro do painel existe uma página dedicada a **Utilizadores**, onde o administrador pode consultar todas as contas registadas.

Esta página lista dados como nome, email e nível de acesso, e disponibiliza ações administrativas:

* **Promover a Admin**: altera a `role` do utilizador para `ADMIN`.
* **Suspender conta**: restringe temporariamente o acesso do utilizador.
* **Banir conta**: bloqueia a conta de forma mais restritiva.

Estas ações devem ser registadas em **`audit_logs`** para garantir rastreabilidade.

## Validação de Ficheiros

A página **Validação de Ficheiros** permite consultar todos os materiais existentes, independentemente do estado atual.

Para cada ficheiro são apresentados título, tipo, tamanho, disciplina associada, utilizador que submeteu o material, soma dos votos e ações administrativas.

## Filtros e Moderação

A validação de ficheiros inclui filtro por disciplina, permitindo visualizar apenas materiais de uma unidade curricular específica.

As ações principais são:
* **Ocultar ficheiro**: altera o `status` para `HIDDEN`.
* **Repor ficheiro**: remove votos associados e altera o `status` para `VISIBLE`.
* **Eliminar ficheiro**: remove permanentemente o material.

Cada ação relevante gera uma entrada em **`audit_logs`**.

## Tratamento de Erros e Loading

As ações administrativas que interagem com a base de dados usam tratamento explícito de erros.

No frontend é reutilizado o contexto global:

```ts
useGlobalError()
```

Isto evita falhas silenciosas e apresenta mensagens claras ao administrador.

Durante operações como ocultar, repor ou eliminar ficheiros, os botões apresentam estados de loading, como **A ocultar...**, **A repor...** e **A eliminar...**.

## Logs do Sistema

A página **Logs do Sistema** apresenta os registos da tabela **`audit_logs`**, incluindo data, administrador responsável e descrição da ação.

Os logs usam paginação para consultar todo o histórico sem carregar demasiados registos de uma só vez.

```txt
50 logs por página
```

## Tabelas Utilizadas

O painel interage principalmente com:

* **`profiles`**: permissões e gestão de utilizadores.
* **`materials`**: gestão e moderação de ficheiros.
* **`votes`**: remoção de votos ao repor ficheiros.
* **`disciplines`**: filtro e identificação da disciplina.
* **`audit_logs`**: histórico de ações administrativas.