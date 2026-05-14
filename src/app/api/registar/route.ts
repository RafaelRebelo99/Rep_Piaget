import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const weakPasswords = [
  '12345678',
  'password',
  'qwerty',
  'qwerty123',
  '123456789',
  '11111111',
  '00000000',
  'abc12345',
]

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword } = await req.json()

    const normalName = String(name || '').trim()
    const normalEmail = String(email || '').trim().toLowerCase()
    const normalPassword = String(password || '').trim()
    const normalConfirmPassword = String(confirmPassword || '').trim()

    const passwordLower = normalPassword.toLowerCase()
    const emailUsername = normalEmail.split('@')[0]

    if (!normalName) {
      return NextResponse.json(
        { error: 'Por favor, introduza o seu nome completo.' },
        { status: 400 }
      )
    }

    if (
        !normalEmail.endsWith('@ipiaget.pt') &&
        !normalEmail.endsWith('@rep.pt')
    ) {
      return NextResponse.json(
        { error: 'Por favor, introduza o seu email institucional.' },
        { status: 400 }
      )
    }

    if (!normalPassword) {
      return NextResponse.json(
        { error: 'Por favor, introduza uma palavra-passe.' },
        { status: 400 }
      )
    }

    if (normalPassword.length < 8) {
      return NextResponse.json(
        { error: 'A palavra-passe deve ter pelo menos 8 caracteres.' },
        { status: 400 }
      )
    }

    if (weakPasswords.includes(passwordLower)) {
      return NextResponse.json(
        { error: 'A palavra-passe é muito fraca.' },
        { status: 400 }
      )
    }

    if (emailUsername && passwordLower.includes(emailUsername)) {
      return NextResponse.json(
        { error: 'A palavra-passe não deve conter o nome do email.' },
        { status: 400 }
      )
    }

    if (normalEmail && passwordLower.includes(normalEmail)) {
      return NextResponse.json(
        { error: 'A palavra-passe não deve conter o email.' },
        { status: 400 }
      )
    }

    if (!normalConfirmPassword) {
      return NextResponse.json(
        { error: 'Por favor, confirme a palavra-passe.' },
        { status: 400 }
      )
    }

    if (normalPassword !== normalConfirmPassword) {
      return NextResponse.json(
        { error: 'As palavras-passe não coincidem.' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signUp({
      email: normalEmail,
      password: normalPassword,
      options: {
        data: {
          name: normalName,
          full_name: normalName,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        { error: 'Não foi possível criar a conta. Verifique os dados e tente novamente.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso.',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: normalName,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Erro ao criar conta.' },
      { status: 500 }
    )
  }
}
