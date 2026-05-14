import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const normalEmail = String(email || '').trim().toLowerCase()
    const normalPassword = String(password || '')

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
        { error: 'Por favor, introduza a sua palavra-passe.' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalEmail,
      password: normalPassword,
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Email ou palavra-passe inválidos.' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Login efetuado com sucesso.',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Erro ao iniciar sessão.' },
      { status: 500 }
    )
  }
}
