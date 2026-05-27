import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import {
  validatePassword,
  validatePasswordConfirmation,
} from '@/utils/passwordValidation'

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword } = await req.json()

    const rawEmail = String(email || '')
    const normalName = String(name || '').trim()
    const normalEmail = rawEmail.trim().toLowerCase()
    const normalPassword = String(password || '').trim()
    const normalConfirmPassword = String(confirmPassword || '').trim()

    const emailHasSpaces = /\s/.test(rawEmail)

    if (!normalName) {
      return NextResponse.json(
        { error: 'Por favor, introduza o seu nome completo.' },
        { status: 400 }
      )
    }

    if (!normalEmail) {
      return NextResponse.json(
        { error: 'Por favor, introduza o seu email.' },
        { status: 400 }
      )
    }

    if (emailHasSpaces) {
      return NextResponse.json(
        { error: 'O email não pode conter espaços.' },
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

    const passwordValidationError = validatePassword({
      password: normalPassword,
      email: normalEmail,
    })

    if (passwordValidationError) {
      return NextResponse.json(
        { error: passwordValidationError },
        { status: 400 }
      )
    }

    const confirmPasswordValidationError = validatePasswordConfirmation({
      password: normalPassword,
      confirmPassword: normalConfirmPassword,
    })

    if (confirmPasswordValidationError) {
      return NextResponse.json(
        { error: confirmPasswordValidationError },
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

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: existingProfile, error: existingProfileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', normalEmail)
      .maybeSingle()

    if (existingProfileError) {
      console.error('Erro ao verificar perfil existente:', existingProfileError)

      return NextResponse.json(
        { error: 'Não foi possível validar o email. Tente novamente.' },
        { status: 500 }
      )
    }

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Tentou registar com um email existente.' },
        { status: 409 }
      )
    }

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
      console.error('Erro ao criar conta:', error)

      const message = error.message.toLowerCase()

      if (
        message.includes('already registered') ||
        message.includes('already exists') ||
        message.includes('user already registered')
      ) {
        return NextResponse.json(
          { error: 'Tentou registar com um email existente.' },
          { status: 409 }
        )
      }

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
  } catch (error) {
    console.error('Erro no backend de registo:', error)

    return NextResponse.json(
      { error: 'Erro ao criar conta.' },
      { status: 500 }
    )
  }
}
