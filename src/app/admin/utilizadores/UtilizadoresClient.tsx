'use client'

import { useState, useMemo, useTransition } from 'react'
import { createClient } from '@/utils/supabase/client'

type Role = 'ADMIN' | 'USER'
type Status = 'ACTIVE' | 'SUSPENDED' | 'BANNED'

interface Utilizador {
  id: string
  full_name: string | null
  email: string | null
  role: Role
  status: Status
  can_upload: boolean | null
}

interface Props {
  utilizadores: Utilizador[]
  adminId: string
}

const ITEMS_PER_PAGE = 10

function getInitials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

const avatarColors: Record<number, { bg: string; text: string }> = {
  0: { bg: 'bg-purple-100', text: 'text-purple-700' },
  1: { bg: 'bg-blue-100', text: 'text-blue-700' },
  2: { bg: 'bg-teal-100', text: 'text-teal-700' },
  3: { bg: 'bg-amber-100', text: 'text-amber-700' },
  4: { bg: 'bg-pink-100', text: 'text-pink-700' },
}

function getAvatarColor(id: string): { bg: string; text: string } {
  return avatarColors[id.charCodeAt(0) % 5]
}

function RoleBadge({ role }: { role: Role }): React.JSX.Element {
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-800">
        Admin
      </span>
    )
  }
  return (
    <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
      Utilizador
    </span>
  )
}

function StatusBadge({ status }: { status: Status }): React.JSX.Element {
  const map: Record<Status, { label: string; className: string }> = {
    ACTIVE:    { label: 'Ativo',    className: 'bg-green-50 text-green-800' },
    SUSPENDED: { label: 'Suspenso', className: 'bg-amber-50 text-amber-800' },
    BANNED:    { label: 'Banido',   className: 'bg-red-50 text-red-800'     },
  }
  const { label, className } = map[status]
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  )
}

export default function UtilizadoresClient({ utilizadores: initial, adminId }: Props): React.JSX.Element {
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>(initial)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<Role | 'ALL'>('ALL')
  const [filterStatus, setFilterStatus] = useState<Status | 'ALL'>('ALL')
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ id: string; message: string } | null>(null)

  const supabase = createClient()

  const filtered = useMemo(() => {
    return utilizadores.filter((u) => {
      const matchSearch =
        search === '' ||
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      const matchRole = filterRole === 'ALL' || u.role === filterRole
      const matchStatus = filterStatus === 'ALL' || u.status === filterStatus
      return matchSearch && matchRole && matchStatus
    })
  }, [utilizadores, search, filterRole, filterStatus])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  async function logAction(action: string): Promise<void> {
    await supabase.from('audit_logs').insert({ admin_id: adminId, action })
  }

  async function updateUser(
    id: string,
    updates: Partial<Pick<Utilizador, 'role' | 'status'>>,
    message: string,
    logMessage: string
  ): Promise<void> {
    startTransition(async () => {
      const { error } = await supabase.from('profiles').update(updates).eq('id', id)
      if (!error) {
        await logAction(logMessage)
        setUtilizadores((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
        setFeedback({ id, message })
        setTimeout(() => setFeedback(null), 2500)
      }
    })
  }

  function handlePromote(u: Utilizador): void {
    const newRole: Role = u.role === 'ADMIN' ? 'USER' : 'ADMIN'
    const message = newRole === 'ADMIN' ? 'Promovido a Admin' : 'Removido de Admin'
    const logMsg = newRole === 'ADMIN'
      ? `UTILIZADOR PROMOVIDO A ADMIN: ${u.full_name ?? u.email}`
      : `ADMIN REMOVIDO: ${u.full_name ?? u.email}`
    updateUser(u.id, { role: newRole }, message, logMsg)
  }

  function handleSuspend(u: Utilizador): void {
    const newStatus: Status = u.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
    const message = newStatus === 'SUSPENDED' ? 'Utilizador suspenso' : 'Suspensão removida'
    const logMsg = newStatus === 'SUSPENDED'
      ? `UTILIZADOR SUSPENSO: ${u.full_name ?? u.email}`
      : `SUSPENSÃO REMOVIDA: ${u.full_name ?? u.email}`
    updateUser(u.id, { status: newStatus }, message, logMsg)
  }

  function handleBan(u: Utilizador): void {
    const newStatus: Status = u.status === 'BANNED' ? 'ACTIVE' : 'BANNED'
    const message = newStatus === 'BANNED' ? 'Utilizador banido' : 'Ban removido'
    const logMsg = newStatus === 'BANNED'
      ? `UTILIZADOR BANIDO: ${u.full_name ?? u.email}`
      : `BAN REMOVIDO: ${u.full_name ?? u.email}`
    updateUser(u.id, { status: newStatus }, message, logMsg)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
          Gestão de Utilizadores
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Utilizadores</h1>
      </div>

      {/* Toolbar — coluna em mobile, linha em sm+ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 h-10">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar utilizador..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Selects lado a lado em mobile */}
        <div className="flex gap-2">
          <select
            value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value as Role | 'ALL'); setPage(1) }}
            className="flex-1 h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 outline-none cursor-pointer"
          >
            <option value="ALL">Todos os papéis</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">Utilizador</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value as Status | 'ALL'); setPage(1) }}
            className="flex-1 h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 outline-none cursor-pointer"
          >
            <option value="ALL">Todos os estados</option>
            <option value="ACTIVE">Ativo</option>
            <option value="SUSPENDED">Suspenso</option>
            <option value="BANNED">Banido</option>
          </select>
        </div>
      </div>

      {/* Table com scroll horizontal em mobile */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Utilizador</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Papel</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Estado</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-sm text-gray-400">
                    Nenhum utilizador encontrado.
                  </td>
                </tr>
              ) : (
                paginated.map((u) => {
                  const { bg, text } = getAvatarColor(u.id)
                  const isFeedback = feedback?.id === u.id
                  return (
                    <tr key={u.id} className={`transition-colors ${isFeedback ? 'bg-green-50/40' : 'hover:bg-gray-50/50'}`}>

                      {/* Utilizador */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${bg} ${text}`}>
                            {getInitials(u.full_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{u.full_name ?? '—'}</p>
                            <p className="text-xs text-gray-400 truncate">{u.email ?? '—'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Papel */}
                      <td className="px-5 py-3.5">
                        <RoleBadge role={u.role} />
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-3.5">
                        {isFeedback ? (
                          <span className="text-xs text-green-700 font-medium">{feedback.message}</span>
                        ) : (
                          <StatusBadge status={u.status} />
                        )}
                      </td>

                      {/* Ações — texto oculto em mobile, só ícone */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">

                          {/* Promover / Remover Admin */}
                          <button
                            onClick={() => handlePromote(u)}
                            disabled={isPending}
                            title={u.role === 'ADMIN' ? 'Remover Admin' : 'Promover a Admin'}
                            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                              u.role === 'ADMIN'
                                ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l7 4 7-4M5 3v10l7 4 7-4V3" />
                            </svg>
                            <span className="hidden sm:inline">
                              {u.role === 'ADMIN' ? 'Remover Admin' : 'Promover'}
                            </span>
                          </button>

                          {/* Suspender */}
                          <button
                            onClick={() => handleSuspend(u)}
                            disabled={isPending}
                            title={u.status === 'SUSPENDED' ? 'Remover suspensão' : 'Suspender'}
                            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                              u.status === 'SUSPENDED'
                                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="hidden sm:inline">
                              {u.status === 'SUSPENDED' ? 'Remover Suspensão' : 'Suspender'}
                            </span>
                          </button>

                          {/* Banir */}
                          <button
                            onClick={() => handleBan(u)}
                            disabled={isPending}
                            title={u.status === 'BANNED' ? 'Remover ban' : 'Banir'}
                            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                              u.status === 'BANNED'
                                ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            <span className="hidden sm:inline">
                              {u.status === 'BANNED' ? 'Remover Ban' : 'Banir'}
                            </span>
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} utilizadores
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg border text-xs font-medium transition-colors ${
                      page === p ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}