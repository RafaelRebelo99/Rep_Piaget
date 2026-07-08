import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const normalEmail = String(email || '').trim().toLowerCase()

    if (!normalEmail) {
      return NextResponse.json(
        { error: 'Por favor, introduza um email institucional válido.' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabasePublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    if (!supabaseUrl || !supabasePublishableKey) {
      return NextResponse.json(
        { error: 'Configuração do Supabase em falta.' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabasePublishableKey)

    const { error } = await supabase.auth.resetPasswordForEmail(normalEmail, {
      redirectTo: `${siteUrl}/update-password`,
    })

    if (error) {
      console.error('Erro ao enviar recuperação:', error)

      if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
        return NextResponse.json(
          {
            error:
              'Foram feitos demasiados pedidos. Aguarde alguns minutos antes de tentar novamente.',
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: 'Não foi possível enviar o email de recuperação.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Email de recuperação enviado com sucesso.',
    })
  } catch (error) {
    console.error('Erro no backend de recuperação:', error)

    return NextResponse.json(
      { error: 'Erro ao recuperar palavra-passe.' },
      { status: 500 }
    )
  }
}