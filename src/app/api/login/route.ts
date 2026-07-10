import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const normalEmail = String(email || '').trim().toLowerCase()
    const normalPassword = String(password || '')

    if (!normalEmail) {
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
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabasePublishableKey) {
      return NextResponse.json(
        { error: 'Configuração do Supabase em falta.' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
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

    if (error) {
      const message = error.message.toLowerCase()

      if (
        message.includes('email not confirmed') ||
        message.includes('not confirmed')
      ) {
        return NextResponse.json(
          { error: 'Confirme o seu email antes de iniciar sessão.' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Email ou palavra-passe invalidos.' },
        { status: 401 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Email ou palavra-passe invalidos.' },
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

    // Registar log de login
    await supabase.from('audit_logs').insert({
      admin_id: data.user.id,
      action: `LOGIN: ${profile.full_name ?? profile.email} entrou na plataforma`,
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
