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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Configuração do Supabase em falta.' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    })

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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, can_upload')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      console.error('Erro ao obter perfil:', profileError)

      return NextResponse.json(
        { error: 'Perfil do utilizador não encontrado.' },
        { status: 404 }
      )
    }

    console.log('Entrou com sucesso:', {
      id: data.user.id,
      email: data.user.email,
      role: profile.role,
    })

    return NextResponse.json({
      success: true,
      message: 'Login efetuado com sucesso.',
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: profile.full_name,
        role: profile.role,
        canUpload: profile.can_upload,
      },
    })
  } catch (error) {
    console.error('Erro no backend de login:', error)

    return NextResponse.json(
      { error: 'Erro ao iniciar sessão.' },
      { status: 500 }
    )
  }
}
