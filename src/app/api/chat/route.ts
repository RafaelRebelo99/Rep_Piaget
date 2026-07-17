import { NextResponse } from 'next/server'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages'
import { createClient } from '@/utils/supabase/server'
import { generateEmbedding } from '@/utils/extractText'

export async function POST(req: Request) {
  try {
    const { messages, disciplineName, disciplineId } = await req.json()

    const supabase = await createClient()

    // Converter a última pergunta em embedding e pesquisar materiais relevantes
    const lastQuestion = messages[messages.length - 1].content
    const queryEmbedding = await generateEmbedding(lastQuestion)

    const { data: chunks } = await supabase.rpc('search_materials', {
      query_embedding: queryEmbedding,
      match_count: 3,
      p_discipline_id: disciplineId ?? null,
    })

    const context = chunks && chunks.length > 0
      ? chunks.map((c: { title: string; content: string }) => `${c.title}:\n${c.content}`).join('\n\n')
      : ''

    if (!context) {
      return NextResponse.json({
        message: 'Não existem materiais disponíveis para esta disciplina. Carrega alguns ficheiros para poderes usar o assistente.',
      })
    }

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
    })

    const systemPrompt = new SystemMessage(
      `És um assistente académico da plataforma REP do Instituto Piaget.
Ajudas estudantes com dúvidas sobre a disciplina de ${disciplineName ?? 'uma unidade curricular'}.
Responde sempre em português europeu.
Sê conciso e claro.
Só podes usar informação dos materiais, menciona o título do documento de onde retiraste.
Se não existirem materiais disponíveis, diz que não tens informação suficiente para responder.
${context ? `\nResponde com base nos seguintes materiais:\n\n${context}` : ''}`
    )

    const history = messages.map((msg: { role: string; content: string }) =>
      msg.role === 'user'
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    )

    const response = await model.invoke([systemPrompt, ...history])

    return NextResponse.json({ message: response.content })
  } catch (err) {
    console.error('Erro no chat:', err)
    return NextResponse.json({ error: 'Erro ao processar a mensagem.' }, { status: 500 })
  }
}
