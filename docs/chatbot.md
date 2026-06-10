# Chatbot REP AI

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

Cada ficheiro carregado tem o seu texto extraído e convertido num vetor de 3072 dimensões que é guardado na tabela `materials`. Quando o utilizador faz uma pergunta, a mesma é convertida em vetor e comparada com os vetores guardados para encontrar os documentos mais relevantes.

## Pré-requisitos

### 1. Google AI API Key

Cria uma chave em [aistudio.google.com](https://aistudio.google.com/) e adiciona ao `.env.local`:

```env
GOOGLE_API_KEY=tua-chave-aqui
```

### 2. Base de dados (Supabase)

A extensão `pgvector` tem de estar ativa e a tabela `materials` precisa das colunas `content` (text) e `embedding` (vector de 3072 dimensões). Consulta o ficheiro `src/utils/supabase/db_schema.sql` para o schema completo.

### 3. Função de pesquisa semântica

A função `search_materials` tem de existir no Supabase. Recebe o embedding da pergunta e o `discipline_id` e devolve os materiais mais relevantes por similaridade. O SQL encontra-se no ficheiro `src/utils/supabase/db_schema.sql`.

## Testar em desenvolvimento

Com o servidor a correr (`npm run dev`), podes testar via terminal:

```bash
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages": [{"role": "user", "content": "O que é uma derivada?"}], "disciplineName": "Matemática", "disciplineId": "UUID-DA-DISCIPLINA"}'
```

O `disciplineId` é o UUID da disciplina na tabela `disciplines` do Supabase.

Se a disciplina não tiver materiais carregados, o chatbot responde que não tem informação suficiente.

## Ficheiros relevantes

| Ficheiro | Função |
|---|---|
| `src/utils/extractText.ts` | Extração de texto (PDF, DOCX, PPTX, TXT, MD) e geração de embeddings |
| `src/app/api/materials/route.ts` | Upload — extrai texto e guarda embedding para todos os tipos suportados |
| `src/app/api/chat/route.ts` | Chat — pesquisa RAG filtrada por disciplina e chama o Gemini |
| `src/components/ChatPanel.tsx` | Interface do chat (slide-in panel redimensionável) |

## Variáveis de ambiente necessárias

```env
GOOGLE_API_KEY=                    # Google AI Studio — chat e embeddings
NEXT_PUBLIC_SUPABASE_URL=          # URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Chave anon do Supabase
```

## Limitações conhecidas

- O modelo gratuito do Gemini tem limites de quota — se atingires o limite, muda o modelo em `chat/route.ts` para `gemini-2.0-flash` ou `gemini-1.5-flash`
- Ficheiros `xlsx` e `doc` (formato Word antigo) fazem upload normalmente mas sem extração de texto, não estando disponíveis para o RAG
- Documentos muito grandes são guardados como texto completo (chunking não implementado — justificado pelo limite de 10MB por ficheiro)
