# Quiz de Materiais

O módulo de quizzes gera automaticamente perguntas de escolha múltipla com base no conteúdo dos materiais carregados numa disciplina.

## Como funciona

```
Utilizador clica em "Gerar Quizz"
       ↓
Seleciona os materiais a incluir
       ↓
Backend busca o texto (content) de cada material por ID
       ↓
Contexto enviado ao Gemini (gemini-2.5-flash)
       ↓
5 perguntas de escolha múltipla geradas em JSON
       ↓
Quiz interativo step-by-step com score final
```

Ao contrário do chatbot, o quiz **não usa embeddings nem RAG** — vai buscar o texto completo dos materiais selecionados diretamente da coluna `content` da tabela `materials`.

## Pré-requisitos

### 1. Google AI API Key

A mesma chave usada pelo chatbot:

```env
GOOGLE_API_KEY=tua-chave-aqui
```

### 2. Materiais com conteúdo extraído

O quiz só funciona com materiais que tenham a coluna `content` preenchida. Isso acontece automaticamente no upload para ficheiros PDF, DOCX, PPTX, TXT e MD. Ficheiros `xlsx` e `doc` (Word antigo) fazem upload mas sem extração de texto — não ficam disponíveis para o quiz.

## Testar em desenvolvimento

Com o servidor a correr (`npm run dev`), podes testar via terminal passando os UUIDs dos materiais:

```bash
curl -X POST http://localhost:3000/api/quiz \
  -H "Content-Type: application/json" \
  -d '{
    "materialIds": ["UUID-MATERIAL-1", "UUID-MATERIAL-2"],
    "disciplineName": "Sistemas Embebidos"
  }'
```

Os UUIDs dos materiais encontram-se na tabela `materials` do Supabase. A resposta é um JSON com 5 perguntas:

```json
{
  "questions": [
    {
      "question": "Texto da pergunta",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "answer": 2,
      "explanation": "Explicação de porque a opção C está correta."
    }
  ]
}
```

## Ficheiros relevantes

| Ficheiro | Função |
|---|---|
| `src/app/api/quiz/route.ts` | Endpoint — busca conteúdo por ID e chama o Gemini |
| `src/components/QuizModal.tsx` | Modal com seleção de materiais, quiz e score |
| `src/components/MaterialsSection.tsx` | Botão "Gerar Quizz" que abre o modal |

## Fluxo da interface

1. **Seleção** — todos os materiais visíveis da disciplina aparecem pré-selecionados; o utilizador pode ajustar
2. **Loading** — quiz gerado em tempo real (~10–15 segundos)
3. **Quiz** — uma pergunta de cada vez com barra de progresso
4. **Score** — resultado final com opção de repetir ou mudar materiais

## Limitações conhecidas

- O Gemini gera sempre 5 perguntas — número fixo não configurável pelo utilizador
- Materiais muito grandes podem exceder o limite de tokens do Gemini; nesse caso seleciona menos materiais
- O modelo gratuito tem limites de quota — se atingires o limite, muda o modelo em `quiz/route.ts` para `gemini-2.0-flash`
- As perguntas são geradas de forma aleatória a cada chamada — não há persistência dos quizzes gerados
