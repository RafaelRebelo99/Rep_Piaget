import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

interface AuditLog {
  id: string
  admin_id: string
  action: string
  created_at: string
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

const ITEMS_PER_PAGE = 50

export default async function LogsPage(): Promise<React.JSX.Element> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN') redirect('/')

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('id, admin_id, action, created_at, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(ITEMS_PER_PAGE)

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
    if (action.includes('BANIDO') || action.includes('REMOVIDO')) return 'text-red-500'
    if (action.includes('SUSPENSO')) return 'text-amber-500'
    if (action.includes('ADMIN')) return 'text-blue-500'
    if (action.includes('UPLOAD')) return 'text-green-500'
    return 'text-gray-400'
  }

  function getActionLevel(action: string): string {
    if (action.includes('BANIDO') || action.includes('REMOVIDO')) return 'ERROR'
    if (action.includes('SUSPENSO')) return 'WARN'
    if (action.includes('ADMIN') || action.includes('UPLOAD')) return 'INFO'
    return 'INFO'
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-400 font-mono">audit_logs — últimas {ITEMS_PER_PAGE} entradas</span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {logs?.length ?? 0} registos
          </span>
        </div>

        {/* Log entries */}
        <div className="px-6 py-5 font-mono text-xs flex flex-col gap-2 max-h-[600px] overflow-y-auto">
          {!logs || logs.length === 0 ? (
            <p className="text-gray-500">Nenhum log registado ainda.</p>
          ) : (
            (logs as unknown as AuditLog[]).map((log) => {
              const level = getActionLevel(log.action)
              const color = getActionColor(log.action)
              const adminName = log.profiles?.full_name ?? log.profiles?.email ?? log.admin_id
              return (
                <div key={log.id} className="flex gap-3 leading-relaxed">
                  <span className="text-gray-600 shrink-0">[{formatDate(log.created_at)}]</span>
                  <span className={`shrink-0 font-semibold ${
                    level === 'ERROR' ? 'text-red-400' :
                    level === 'WARN' ? 'text-amber-400' :
                    'text-green-400'
                  }`}>{level}:</span>
                  <span className="text-gray-400">
                    <span className="text-white">{adminName}</span>
                    {' → '}
                    <span className={color}>{log.action}</span>
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {logs && logs.length === ITEMS_PER_PAGE && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          A mostrar as últimas {ITEMS_PER_PAGE} entradas.
        </p>
      )}
    </div>
  )
}
