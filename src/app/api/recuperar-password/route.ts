import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const normalEmail = String(email || '').trim().toLowerCase()

    if (
      !normalEmail.endsWith('@ipiaget.pt') &&
      !normalEmail.endsWith('@rep.pt')
    ) {
      return NextResponse.json(
        { error: 'Por favor, introduza um email institucional válido.' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Configuração do Supabase em falta.' },
        { status: 500 }
      )
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { error } = await supabase.auth.resetPasswordForEmail(normalEmail, {
      redirectTo: `${origin}/atualizar-password`,
    })

    if (error) {
  console.error('Erro ao enviar recuperação:', error)

  if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
    return NextResponse.json(
      { error: 'Foram feitos demasiados pedidos. Aguarde alguns minutos antes de tentar novamente.' },
      { status: 429 }
    )
  }

  return NextResponse.json(
    { error: 'Não foi possível enviar o email de recuperação.' },
    { status: 400 }
  )
}

  } catch (error) {
    console.error('Erro no backend de recuperação:', error)

    return NextResponse.json(
      { error: 'Erro ao recuperar palavra-passe.' },
      { status: 500 }
    )
  }
}
