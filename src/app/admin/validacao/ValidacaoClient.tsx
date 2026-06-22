'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useGlobalError } from '@/utils/errorContext'

interface SubmittedBy {
  id: string
  full_name: string | null
  email: string | null
}

interface Ficheiro {
  id: string
  title: string
  file_type: string
  file_size: number
  created_at: string
  user_id: string
  status: 'VISIBLE' | 'HIDDEN'
  discipline_id: string
  disciplineName: string
  submittedBy: SubmittedBy | null
  votes: { value: number }[]
}

interface Props {
  ficheiros: Ficheiro[]
  adminId: string
  totalHidden: number
  totalVisible: number
}

type LoadingAction = {
  id: string
  action: 'reset' | 'hide' | 'delete'
} | null

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

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

function FileTypeIcon({ type }: { type: string }): React.JSX.Element {
  const map: Record<string, { bg: string; text: string }> = {
    PDF:  { bg: 'bg-red-50',   text: 'text-red-700'   },
    DOCX: { bg: 'bg-blue-50',  text: 'text-blue-700'  },
    DOC:  { bg: 'bg-blue-50',  text: 'text-blue-700'  },
    PPTX: { bg: 'bg-amber-50', text: 'text-amber-700' },
    XLSX: { bg: 'bg-green-50', text: 'text-green-700' },
    TXT:  { bg: 'bg-gray-100', text: 'text-gray-600'  },
    MD:   { bg: 'bg-gray-100', text: 'text-gray-600'  },
  }
  const colors = map[type.toUpperCase()] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${colors.bg} ${colors.text}`}>
      {type.toUpperCase().slice(0, 3)}
    </div>
  )
}

function VoteBadge({ voteSum }: { voteSum: number }): React.JSX.Element {
  if (voteSum > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        {voteSum}
      </span>
    )
  }
  if (voteSum < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-700">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {voteSum}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
      0
    </span>
  )
}

export default function ValidacaoClient({
  ficheiros: initial,
  adminId,
  totalHidden,
  totalVisible,
}: Props): React.JSX.Element {
  const [ficheiros, setFicheiros] = useState<Ficheiro[]>(initial)
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all')
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null)

  const supabase = createClient()
  const { showError } = useGlobalError()

  const isLoading = loadingAction !== null

  const disciplines = Array.from(new Set(ficheiros.map((f) => f.disciplineName))).sort()

  const filteredFicheiros = selectedDiscipline === 'all'
    ? ficheiros
    : ficheiros.filter((f) => f.disciplineName === selectedDiscipline)

  function getVoteSum(votes: { value: number }[]): number {
    return votes.reduce((acc, v) => acc + v.value, 0)
  }

  function isActionLoading(id: string, action: 'reset' | 'hide' | 'delete'): boolean {
    return loadingAction?.id === id && loadingAction.action === action
  }

  async function handleReset(ficheiro: Ficheiro): Promise<void> {
    if (isLoading) return
    setLoadingAction({ id: ficheiro.id, action: 'reset' })
    try {
      const { error: votesError } = await supabase.from('votes').delete().eq('material_id', ficheiro.id)
      if (votesError) throw votesError

      const { error: statusError } = await supabase.from('materials').update({ status: 'VISIBLE' }).eq('id', ficheiro.id)
      if (statusError) throw statusError

      const userName = ficheiro.submittedBy?.full_name ?? ficheiro.submittedBy?.email ?? 'Desconhecido'
      const { error: auditError } = await supabase.from('audit_logs').insert({
        admin_id: adminId,
        action: `VOTOS RESETADOS: "${ficheiro.title}" submetido por ${userName} - ficheiro reposto como visivel`,
      })
      if (auditError) throw auditError

      setFicheiros((prev) => prev.map((f) => f.id === ficheiro.id ? { ...f, status: 'VISIBLE', votes: [] } : f))
    } catch (error) {
      console.error('Erro ao repor ficheiro:', error)
      showError('Nao foi possivel repor este ficheiro.', 'Erro ao repor')
    } finally {
      setLoadingAction(null)
    }
  }

  async function handleHide(ficheiro: Ficheiro): Promise<void> {
    if (isLoading) return
    setLoadingAction({ id: ficheiro.id, action: 'hide' })
    try {
      const { error } = await supabase.from('materials').update({ status: 'HIDDEN' }).eq('id', ficheiro.id)
      if (error) throw error

      const userName = ficheiro.submittedBy?.full_name ?? ficheiro.submittedBy?.email ?? 'Desconhecido'
      const { error: auditError } = await supabase.from('audit_logs').insert({
        admin_id: adminId,
        action: `FICHEIRO OCULTADO: "${ficheiro.title}" submetido por ${userName}`,
      })
      if (auditError) throw auditError

      setFicheiros((prev) => prev.map((f) => f.id === ficheiro.id ? { ...f, status: 'HIDDEN' } : f))
    } catch (error) {
      console.error('Erro ao ocultar ficheiro:', error)
      showError('Nao foi possivel ocultar este ficheiro.', 'Erro ao ocultar')
    } finally {
      setLoadingAction(null)
    }
  }

  async function handleDelete(ficheiro: Ficheiro): Promise<void> {
    if (isLoading) return
    setLoadingAction({ id: ficheiro.id, action: 'delete' })
    try {
      const { error } = await supabase.from('materials').delete().eq('id', ficheiro.id)
      if (error) throw error

      const userName = ficheiro.submittedBy?.full_name ?? ficheiro.submittedBy?.email ?? 'Desconhecido'
      const { error: auditError } = await supabase.from('audit_logs').insert({
        admin_id: adminId,
        action: `FICHEIRO ELIMINADO: "${ficheiro.title}" submetido por ${userName}`,
      })
      if (auditError) throw auditError

      setFicheiros((prev) => prev.filter((f) => f.id !== ficheiro.id))
    } catch (error) {
      console.error('Erro ao eliminar ficheiro:', error)
      showError('Nao foi possivel eliminar este ficheiro.', 'Erro ao eliminar')
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
          Gestão de Conteúdo
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Validação de Ficheiros</h1>
      </div>

      {/* Stat cards — 1 coluna em mobile, 3 em sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Ficheiros Ocultos</p>
          <p className="text-3xl font-bold text-amber-700">{totalHidden}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Ficheiros Visíveis</p>
          <p className="text-3xl font-bold text-green-700">{totalVisible}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Total de Ficheiros</p>
          <p className="text-3xl font-bold text-gray-900">{totalVisible + totalHidden}</p>
        </div>
      </div>

      {/* Filtro disciplina */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label htmlFor="discipline-filter" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Disciplina
        </label>
        <select
          id="discipline-filter"
          value={selectedDiscipline}
          onChange={(e) => setSelectedDiscipline(e.target.value)}
          disabled={isLoading}
          className="w-full sm:w-auto sm:min-w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-300 disabled:opacity-50"
        >
          <option value="all">Todas as disciplinas</option>
          {disciplines.map((discipline) => (
            <option key={discipline} value={discipline}>{discipline}</option>
          ))}
        </select>
      </div>

      {/* Tabela com scroll horizontal em mobile */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Ficheiro</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Submetido por</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Votos</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredFicheiros.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-sm text-gray-400">
                    Nenhum ficheiro encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredFicheiros.map((f) => {
                  const { bg, text } = getAvatarColor(f.id)
                  const voteSum = getVoteSum(f.votes)
                  const userName = f.submittedBy?.full_name ?? f.submittedBy?.email ?? '-'

                  return (
                    <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">

                      {/* Ficheiro */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <FileTypeIcon type={f.file_type} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{f.title}</p>
                            <p className="text-xs text-gray-400">{formatBytes(f.file_size)} · {f.disciplineName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Submetido por */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${bg} ${text}`}>
                            {getInitials(f.submittedBy?.full_name ?? null)}
                          </div>
                          <span className="text-sm text-gray-700 truncate">{userName}</span>
                        </div>
                      </td>

                      {/* Votos */}
                      <td className="px-5 py-3.5">
                        <VoteBadge voteSum={voteSum} />
                      </td>

                      {/* Ações */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {f.status === 'HIDDEN' ? (
                            <button
                              onClick={() => handleReset(f)}
                              disabled={isLoading}
                              title="Resetar votos e repor ficheiro"
                              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                            >
                              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span className="hidden sm:inline">
                                {isActionLoading(f.id, 'reset') ? 'A repor...' : 'Repor'}
                              </span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleHide(f)}
                              disabled={isLoading}
                              title="Ocultar ficheiro"
                              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50"
                            >
                              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                              <span className="hidden sm:inline">
                                {isActionLoading(f.id, 'hide') ? 'A ocultar...' : 'Ocultar'}
                              </span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(f)}
                            disabled={isLoading}
                            title="Eliminar ficheiro permanentemente"
                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden sm:inline">
                              {isActionLoading(f.id, 'delete') ? 'A eliminar...' : 'Eliminar'}
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
      </div>
    </div>
  )
}