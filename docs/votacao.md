# Sistema de Votação e Moderação Comunitária

O REP Piaget utiliza um sistema descentralizado e focado na comunidade para avaliar a qualidade dos materiais e filtrar automaticamente conteúdos indesejados. Este documento explica a lógica técnica implementada nos componentes.

## 1. Lógica de Votação (`MaterialCard.tsx`)

Os utilizadores autenticados podem votar em materiais através de *Upvotes* (+1) ou *Downvotes* (-1). A lógica interage diretamente com o Supabase utilizando um comportamento de `UPSERT` e `DELETE`.

- **Novo Voto ou Alteração:** Se o utilizador clicar numa opção em que ainda não votou (ou para alterar o seu voto atual), a aplicação efetua um `upsert` na tabela `votes`. O Supabase resolve conflitos usando a chave composta `user_id, material_id`.
- **Remoção de Voto (Toggle):** Se o utilizador clicar na opção que já se encontra selecionada (ex: clicar *Upvote* quando já deu *Upvote*), o sistema interpreta isso como uma intenção de remover o voto, efetuando um `delete` desse registo na base de dados.

O `Score` total do material é recalculado em tempo real fazendo um `reduce` sobre o valor de todos os votos obtidos para aquele `material_id`.

## 2. Moderação Automática e Ocultação Visual

Existe uma regra de segurança essencial para o controlo de qualidade: **Se o Score (pontuação) de um material for igual ou inferior a -5, ele entra num estado crítico.**

Quando isto acontece na UI:
1. **Alerta Visual:** O ficheiro deixa de mostrar o botão de Download normal e, em vez disso, exibe um banner vermelho de alerta informando que *"o ficheiro atingiu o limite de votos negativos comunitários"*.
2. **Ações do Utilizador no Estado Crítico:**
   - **Reverter Voto:** O utilizador que provocou a descida do score tem a oportunidade de reverter o seu voto (usando o botão circular), o que fará o score subir novamente para -4, recuperando o aspeto original do ficheiro.
   - **Confirmar e Manter:** Clicar no botão do "Check" ativa o estado local `isDismissed = true`, ocultando o componente completamente do ecrã do utilizador que o dispensou.

## 3. Ocultação Global (`MaterialsSection.tsx`)

Além da validação de score local, o próprio repositório implementa uma verificação estrita antes sequer de renderizar a lista de cartões.

Se o objeto do material vier da base de dados com uma flag global `status === 'HIDDEN'`, ele será imediatamente removido dos arrays filtrados na UI:

```typescript
const filteredMaterials = materials.filter((mat) => {
  if (mat.status === 'HIDDEN') return false
  // ... restante lógica de pesquisa
})
```
Isto assegura que materiais sinalizados explicitamente pela administração (ou através de *triggers* da DB) nunca cheguem ao render, garantindo a segurança e organização do repositório.
