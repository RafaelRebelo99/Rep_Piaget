'use client'

import { useState } from 'react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface SuggestModalCourseProps {
  userName: string
  userEmail: string
  onClose: () => void
}

const MAX_CHARS = 30

export default function SuggestModalCourse({ userName, userEmail, onClose }: SuggestModalCourseProps) {
  const [courseName, setCourseName] = useState('')
  const [extra, setExtra] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!courseName.trim()) return

    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    const { error: insertError } = await supabase
      .from('course_suggestions')
      .insert({
        course_name: courseName.trim(),
        reason: extra.trim() || null,
        user_name: userName,
        user_email: userEmail,
      })

    setIsSubmitting(false)

    if (insertError) {
      console.error('Erro ao guardar sugestão:', insertError)
      setError('Não foi possível enviar a sugestão. Tenta novamente.')
      return
    }

    setIsSuccess(true)
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sugerir um Curso</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <CheckCircle2 className="w-12 h-12 text-primary" />
            <p className="text-sm font-semibold text-gray-700">Sugestão enviada com sucesso!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">

            {/* Nome do curso (obrigatório) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                Nome do curso <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Ex: Engenharia Informática"
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-16 text-sm text-gray-800 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                />
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold ${
                  courseName.length === MAX_CHARS ? 'text-primary' : 'text-gray-300'
                }`}>
                  {courseName.length}/{MAX_CHARS}
                </span>
              </div>
            </div>

            {/* Motivo ou link (opcional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                Motivo ou link de referência <span className="text-gray-300 normal-case font-normal">(opcional)</span>
              </label>
              <textarea
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Ex: Novo curso ou https://..."
                rows={3}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-none disabled:opacity-60"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-500">{error}</p>
            )}

            {/* Botões */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!courseName.trim() || isSubmitting}
                className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    A enviar...
                  </>
                ) : (
                  'Enviar Sugestão'
                )}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
