'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Check, X, Loader2 } from 'lucide-react'

interface CourseSuggestion {
  id: string
  course_name: string
  reason: string | null
  user_name: string
  user_email: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_at: string
}

interface CourseSuggestionsListProps {
  initialSuggestions: CourseSuggestion[]
}

const statusConfig: Record<CourseSuggestion['status'], { label: string; className: string }> = {
  PENDING: { label: 'Pendente', className: 'text-yellow-700 bg-yellow-50' },
  APPROVED: { label: 'Aprovado', className: 'text-green-700 bg-green-50' },
  REJECTED: { label: 'Rejeitado', className: 'text-red-700 bg-red-50' },
}

export default function CourseSuggestionsList({ initialSuggestions }: CourseSuggestionsListProps) {
  const [suggestions, setSuggestions] = useState<CourseSuggestion[]>(initialSuggestions)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setLoadingId(id)
    const supabase = createClient()

    const { error } = await supabase
      .from('course_suggestions')
      .update({ status: 'APPROVED' })
      .eq('id', id)

    setLoadingId(null)

    if (error) {
      console.error('Erro ao aprovar sugestão:', error)
      return
    }

    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'APPROVED' } : s))
    )
  }

  const handleReject = async (id: string) => {
    setLoadingId(id)
    const supabase = createClient()

    const { error } = await supabase
      .from('course_suggestions')
      .delete()
      .eq('id', id)

    setLoadingId(null)

    if (error) {
      console.error('Erro ao rejeitar sugestão:', error)
      return
    }

    setSuggestions((prev) => prev.filter((s) => s.id !== id))
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray-400">Ainda não há sugestões de curso.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {suggestions.map((s) => {
          const { label, className } = statusConfig[s.status]
          const isLoading = loadingId === s.id

          return (
            <div key={s.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold text-gray-900 truncate">{s.course_name}</p>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${className}`}>
                    {label}
                  </span>
                </div>
                {s.reason && (
                  <p className="text-sm text-gray-500 mb-1 line-clamp-2">{s.reason}</p>
                )}
                <p className="text-xs text-gray-400">
                  {s.user_name} · {s.user_email} · {new Date(s.created_at).toLocaleDateString('pt-PT')}
                </p>
              </div>

              {s.status === 'PENDING' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(s.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleReject(s.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}