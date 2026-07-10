import { NextResponse } from 'next/server'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createClient } from '@/utils/supabase/server'

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export async function POST(req: Request) {
  try {
    const { materialIds, disciplineName }: { materialIds: string[], disciplineName: string } = await req.json()

    if (!materialIds || materialIds.length === 0) {
      return NextResponse.json({ error: 'Seleciona pelo menos um material.' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: materials, error } = await supabase
      .from('materials')
      .select('title, content')
      .in('id', materialIds)

    if (error || !materials) {
      return NextResponse.json({ error: 'Erro ao carregar os materiais.' }, { status: 500 })
    }

    const context = materials
      .filter(m => m.content)
      .map(m => `${m.title}:\n${m.content}`)
      .join('\n\n')

    if (!context) {
      return NextResponse.json({ error: 'Os materiais selecionados não têm conteúdo extraído.' }, { status: 400 })
    }

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
    })

    const systemPrompt = new SystemMessage(
      `És um professor que cria quizzes de avaliação para estudantes universitários portugueses.
Cria exatamente 5 perguntas de escolha múltipla em português europeu baseadas nos materiais fornecidos.
Cada pergunta deve ter exatamente 4 opções onde apenas uma está correta.
Devolve APENAS JSON válido neste formato:
{
  "questions": [
    {
      "question": "texto da pergunta",
      "options": ["opção A", "opção B", "opção C", "opção D"],
      "answer": 0,
      "explanation": "explicação curta de porque a opção correta está certa"
    }
  ]
}
O campo "answer" é o índice (0-3) da opção correta em "options".
As perguntas devem ser variadas e cobrir diferentes partes dos materiais.`
    )

    const userMessage = new HumanMessage(
      `Cria um quiz sobre ${disciplineName} com base nestes materiais:\n\n${context}`
    )

    const response = await model.invoke([systemPrompt, userMessage])

    let quiz: { questions: QuizQuestion[] }
    try {
      const raw = (response.content as string).replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
      quiz = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'Erro ao processar as perguntas geradas.' }, { status: 500 })
    }

    if (!quiz.questions || !Array.isArray(quiz.questions)) {
      return NextResponse.json({ error: 'Formato de quiz inválido.' }, { status: 500 })
    }

    return NextResponse.json(quiz)
  } catch (err) {
    console.error('Erro no quiz:', err)
    return NextResponse.json({ error: 'Erro ao gerar o quiz.' }, { status: 500 })
  }
}
