import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabasePublishableKey) {
      return NextResponse.json(
        { user: null, error: 'Configuração do Supabase em falta.' },
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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ user: null })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: profile?.full_name || user.email,
        role: profile?.role || 'USER',
      },
    })
  } catch (error) {
    console.error('Erro ao obter utilizador atual:', error)

    return NextResponse.json(
      { user: null, error: 'Erro ao obter utilizador atual.' },
      { status: 500 }
    )
  }
}
