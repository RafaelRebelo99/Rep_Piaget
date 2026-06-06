# Chatbot REP AI Scholar

O chatbot do REP utiliza RAG (Retrieval-Augmented Generation) para responder a perguntas com base nos materiais carregados em cada disciplina.

## Como funciona

```
Pergunta do utilizador
       ↓
Gerar embedding da pergunta (gemini-embedding-001)
       ↓
Pesquisa semântica na BD (pgvector) → materiais relevantes da disciplina
       ↓
Contexto injetado no prompt do Gemini (gemini-2.5-flash)
       ↓
Resposta baseada nos materiais
```

Cada PDF carregado tem o seu texto extraído e convertido num vetor de 3072 dimensões que é guardado na tabela `materials`. Quando o utilizador faz uma pergunta, a mesma é convertida em vetor e comparada com os vetores guardados para encontrar os documentos mais relevantes.

## Pré-requisitos

### 1. Google AI API Key

Cria uma chave em [aistudio.google.com](https://aistudio.google.com/) e adiciona ao `.env.local`:

```env
GOOGLE_API_KEY=tua-chave-aqui
```

### 2. Base de dados (Supabase)

A extensão `pgvector` tem de estar ativa e a tabela `materials` precisa das colunas:

```sql
-- Ativar extensão
CREATE EXTENSION IF NOT EXISTS vector;

-- Colunas na tabela materials
ALTER TABLE materials ADD COLUMN content text;
ALTER TABLE materials ADD COLUMN embedding vector(3072);
```

### 3. Função de pesquisa semântica

Corre este SQL no Supabase (SQL Editor):

```sql
CREATE OR REPLACE FUNCTION search_materials(
  query_embedding vector(3072),
  match_count int,
  p_discipline_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    title,
    content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM materials
  WHERE
    content IS NOT NULL
    AND (p_discipline_id IS NULL OR discipline_id = p_discipline_id)
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

## Testar em desenvolvimento

Com o servidor a correr (`npm run dev`), podes testar via terminal:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "O que é uma derivada?"}], "disciplineName": "Matemática", "disciplineId": "UUID-DA-DISCIPLINA"}'
```

O `disciplineId` é o UUID da disciplina na tabela `disciplines` do Supabase.

Se a disciplina não tiver materiais com texto extraído, o chatbot responde que não tem informação suficiente.

## Ficheiros relevantes

| Ficheiro | Função |
|---|---|
| `src/utils/extractText.ts` | Extração de texto de PDFs e geração de embeddings |
| `src/app/api/materials/route.ts` | Upload — extrai texto e guarda embedding |
| `src/app/api/chat/route.ts` | Chat — pesquisa RAG e chama o Gemini |
| `src/components/ChatPanel.tsx` | Interface do chat (slide-in panel) |

## Variáveis de ambiente necessárias

```env
GOOGLE_API_KEY=           # Google AI Studio — chat e embeddings
NEXT_PUBLIC_SUPABASE_URL= # URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Chave anon do Supabase
```

## Limitações conhecidas

- Apenas PDFs têm extração de texto automática (outros tipos de ficheiro não geram embeddings)
- O modelo gratuito do Gemini tem limites de quota — se atingires o limite, muda o modelo em `chat/route.ts` para `gemini-2.0-flash` ou `gemini-1.5-flash`
- Documentos muito grandes são guardados como texto completo (chunking não implementado ainda)
