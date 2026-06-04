import { NextResponse } from 'next/server'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages'

export async function POST(req: Request) {
  try {
    const { messages, disciplineName } = await req.json()

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
    })

    const systemPrompt = new SystemMessage(
      `És um assistente académico da plataforma REP do Instituto Piaget.
Ajudas estudantes com dúvidas sobre a disciplina de ${disciplineName ?? 'uma unidade curricular'}.
Responde sempre em português europeu.
Sê conciso e claro.
Não respondas a perguntas fora do contexto académico.`
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
