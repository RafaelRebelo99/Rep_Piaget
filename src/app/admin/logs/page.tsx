import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

interface AuditLog {
  id: string
  admin_id: string | null
  action: string
  created_at: string
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

const ITEMS_PER_PAGE = 50

interface Props {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function LogsPage({ searchParams }: Props): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const params = await searchParams

  const currentPage = Math.max(Number(params.page ?? '1') || 1, 1)
  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN') redirect('/')

  const { data: logs, count } = await supabase
    .from('audit_logs')
    .select('id, admin_id, action, created_at, profiles(full_name, email)', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalLogs = count ?? 0
  const totalPages = Math.max(Math.ceil(totalLogs / ITEMS_PER_PAGE), 1)

  if (currentPage > totalPages && totalLogs > 0) {
    redirect(`/admin/logs?page=${totalPages}`)
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  function getActionColor(action: string): string {
    if (action.includes('BANIDO') || action.includes('REMOVIDO') || action.includes('ELIMINADO')) return 'text-red-400'
    if (action.includes('SUSPENSO') || action.includes('OCULTADO')) return 'text-amber-400'
    if (action.includes('SUPORTE')) return 'text-purple-400'
    if (action.includes('ADMIN')) return 'text-blue-400'
    if (action.includes('UPLOAD') || action.includes('RESETADOS')) return 'text-green-400'
    return 'text-gray-400'
  }

  function getActionLevel(action: string): string {
    if (action.includes('BANIDO') || action.includes('REMOVIDO') || action.includes('ELIMINADO')) return 'ERROR'
    if (action.includes('SUSPENSO') || action.includes('OCULTADO')) return 'WARN'
    if (action.includes('ADMIN') || action.includes('UPLOAD') || action.includes('RESETADOS')) return 'INFO'
    if (action.includes('SUPORTE')) return 'INFO'
    return 'INFO'
  }

  function getPageHref(page: number): string {
    return `/admin/logs?page=${page}`
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
          Auditoria do Sistema
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Logs do Sistema</h1>
      </div>

      {/* Log terminal */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">

        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-400 font-mono truncate">
              audit_logs — pág. {currentPage}/{totalPages}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-mono shrink-0 ml-3">
            {totalLogs} registos
          </span>
        </div>

        {/* Log entries */}
        <div className="px-4 md:px-6 py-5 font-mono text-xs flex flex-col gap-2 max-h-[600px] overflow-y-auto">
          {!logs || logs.length === 0 ? (
            <p className="text-gray-500">Nenhum log registado ainda.</p>
          ) : (
            (logs as unknown as AuditLog[]).map((log) => {
              const level = getActionLevel(log.action)
              const color = getActionColor(log.action)

              // admin_id null = pedido de suporte (utilizador não autenticado)
              const adminName = log.admin_id === null
                ? 'sistema'
                : (log.profiles?.full_name ?? log.profiles?.email ?? log.admin_id)

              return (
                <div key={log.id} className="flex flex-col sm:flex-row sm:gap-3 leading-relaxed gap-0.5">
                  {/* Data — linha própria em mobile */}
                  <span className="text-gray-600 shrink-0">[{formatDate(log.created_at)}]</span>

                  {/* Nível + conteúdo */}
                  <span className="flex gap-2 flex-wrap">
                    <span className={`shrink-0 font-semibold ${
                      level === 'ERROR' ? 'text-red-400' :
                      level === 'WARN'  ? 'text-amber-400' :
                      'text-green-400'
                    }`}>
                      {level}:
                    </span>
                    <span className="text-gray-400 break-all">
                      <span className={log.admin_id === null ? 'text-purple-300' : 'text-white'}>
                        {adminName}
                      </span>
                      {' -> '}
                      <span className={color}>{log.action}</span>
                    </span>
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <p className="text-xs text-gray-400">
            A mostrar {from + 1}–{Math.min(to + 1, totalLogs)} de {totalLogs} entradas.
          </p>

          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={getPageHref(currentPage - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Anterior
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg border border-gray-100 bg-gray-50 text-xs font-medium text-gray-300">
                Anterior
              </span>
            )}

            <span className="px-3 py-1.5 text-xs font-semibold text-gray-500">
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={getPageHref(currentPage + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Seguinte
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg border border-gray-100 bg-gray-50 text-xs font-medium text-gray-300">
                Seguinte
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}