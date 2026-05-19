import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado.' },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores.' },
        { status: 403 }
      )
    }

    const [
      usersResult,
      filesResult,
      pendingFilesResult,
      ticketsResult,
      disciplinesResult,
      logsResult,
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('materials').select('id', { count: 'exact', head: true }),
      supabase
        .from('materials')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'PENDING'),
      supabase.from('feedbacks').select('id', { count: 'exact', head: true }),
      supabase.from('disciplines').select('id, name').limit(5),
      supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    return NextResponse.json({
      success: true,
      admin: {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        role: profile.role,
      },
      stats: {
        totalUsers: usersResult.count ?? 0,
        totalFiles: filesResult.count ?? 0,
        pendingFiles: pendingFilesResult.count ?? 0,
        supportTickets: ticketsResult.count ?? 0,
      },
      disciplines: disciplinesResult.data ?? [],
      logs: logsResult.data ?? [],
    })
  } catch (error) {
    console.error('Erro no painel admin:', error)

    return NextResponse.json(
      { error: 'Erro ao carregar painel de administração.' },
      { status: 500 }
    )
  }
}
