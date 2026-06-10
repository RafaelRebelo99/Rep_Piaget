'use client'

import { useState, useEffect, useMemo } from 'react'
import { MessageSquare, Star, User, Trash2, Edit2, X, Check, EyeOff, Clock, ArrowUpDown, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useGlobalError } from '@/utils/errorContext'

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  user_id?: string;
  discipline_id?: string;
  is_anonymous: boolean;
  created_at: string;
  profiles: { 
    full_name: string; 
    role: string;
  } | null;
}

interface FeedbackSectionProps {
  feedbacks: Feedback[];
  disciplineId: string;
}

export default function FeedbackSection({ feedbacks: initialFeedbacks, disciplineId }: FeedbackSectionProps) {
  const supabase = createClient()
  const { showError } = useGlobalError()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks)
  const [showForm, setShowForm] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [activeFilter, setActiveFilter] = useState<'recent' | 'rating'>('recent')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const MAX_CHARS = 500

  useEffect(() => {
    async function getSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)
    }
    getSession()
  }, [supabase])

  async function handleAddFeedback(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim() || !currentUserId || newComment.length > MAX_CHARS || isSubmitting) return

    setIsSubmitting(true)

    const { data, error } = await supabase
      .from('feedbacks')
      .insert({
        discipline_id: disciplineId,
        user_id: currentUserId,
        rating: newRating,
        comment: newComment.trim(),
        is_anonymous: isAnonymous
      })
      .select('*, profiles(full_name, role)')
      .single()

    if (error) {
      console.error('Erro ao submeter feedback:', error.message)
      showError('Não foi possível publicar o teu comentário. Por favor, tenta novamente.', 'Erro ao Publicar')
      setIsSubmitting(false)
      return
    }

    if (data) {
      setFeedbacks([data as Feedback, ...feedbacks])
      setNewComment('')
      setNewRating(5)
      setIsAnonymous(false)
      setShowForm(false)
    }
    setIsSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (isSubmitting) return
    setIsSubmitting(true)

    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUserId)

    if (error) {
      console.error('Erro ao apagar feedback:', error.message)
      showError('Não foi possível remover este comentário do repositório.', 'Erro ao Eliminar')
      setIsSubmitting(false)
      return
    }

    setFeedbacks(feedbacks.filter(fb => fb.id !== id))
    setIsSubmitting(false)
  }

  async function handleUpdateState(id: string, updatedComment: string, updatedRating: number, updatedAnonymous: boolean) {
    const { error } = await supabase
      .from('feedbacks')
      .update({
        comment: updatedComment,
        rating: updatedRating,
        is_anonymous: updatedAnonymous
      })
      .eq('id', id)
      .eq('user_id', currentUserId)

    if (error) {
      console.error('Erro ao atualizar feedback:', error.message)
      showError('Ocorreu uma falha ao tentar atualizar as alterações no servidor.', 'Erro ao Guardar')
      throw error
    }

    setFeedbacks(feedbacks.map(fb => 
      fb.id === id ? { ...fb, comment: updatedComment, rating: updatedRating, is_anonymous: updatedAnonymous } : fb
    ))
  }

  const handleRecentFilterClick = () => {
    if (activeFilter === 'recent') {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setActiveFilter('recent')
      setSortOrder('desc')
    }
  }

  const handleRatingFilterClick = () => {
    if (activeFilter === 'rating') {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setActiveFilter('rating')
      setSortOrder('desc')
    }
  }

  const orderedFeedbacks = useMemo(() => {
    return [...feedbacks].sort((a, b) => {
      if (activeFilter === 'rating') {
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating
      }
      
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })
  }, [feedbacks, activeFilter, sortOrder])

  const charsLeft = MAX_CHARS - newComment.length
  const counterColor = charsLeft <= 50 ? 'text-red-500 font-bold' : charsLeft <= 100 ? 'text-orange-500 font-semibold' : 'text-gray-400'

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-8 h-fit max-h-[75vh] flex flex-col overflow-hidden">
      
      {/* Cabeçalho Principal e Ação de Entrada */}
      <div className="flex justify-between items-center mb-5 shrink-0">
        <h2 className="text-xl font-bold text-gray-900">Feedback</h2>
        {currentUserId && (
          <button 
            onClick={() => !isSubmitting && setShowForm(!showForm)}
            disabled={isSubmitting}
            className="text-primary hover:text-primary-dark text-xs font-bold flex items-center gap-1.5 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showForm ? 'Fechar Formulário' : (
              <>
                <MessageSquare className="w-3 h-3 transition-transform group-hover:scale-110" /> 
                Dar Feedback
              </>
            )}
          </button>
        )}
      </div>

      {/* Controlos de Filtragem e Ordenação da Lista */}
      {feedbacks.length > 0 && !showForm && (
        <div className="flex gap-2 mb-5 shrink-0 pb-2 border-b border-gray-100">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleRecentFilterClick}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50 ${
              activeFilter === 'recent'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {activeFilter === 'recent' ? (
              sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-white" /> : <ArrowUp className="w-3 h-3 text-white" />
            ) : (
              <Clock className="w-3 h-3 text-gray-400" />
            )}
            {activeFilter === 'recent' && sortOrder === 'asc' ? 'Mais Antigo' : 'Recente'}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleRatingFilterClick}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50 ${
              activeFilter === 'rating'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {activeFilter === 'rating' ? (
              sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-white" /> : <ArrowUp className="w-3 h-3 text-white" />
            ) : (
              <ArrowUpDown className="w-3 h-3 text-gray-400" />
            )}
            Avaliação
          </button>
        </div>
      )}

      {/* Formulário Condicional de Submissão de Comentários */}
      {showForm && (
        <form onSubmit={handleAddFeedback} className="mb-5 p-5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-4 animate-fadeIn shrink-0">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">A tua nota</span>
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-0.5 transition-transform active:scale-125 disabled:scale-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Star className={`w-5 h-5 ${(hoverRating ?? newRating) >= star ? 'fill-current' : 'text-gray-200'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1 relative">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">O teu comentário</span>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={MAX_CHARS}
              disabled={isSubmitting}
              placeholder="O que achas desta unidade curricular? Dicas para exames, resumos..."
              required
              rows={3}
              className="w-full text-xs p-3 pb-7 rounded-lg border border-gray-200 bg-white text-gray-800 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-none transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
            <span className={`absolute bottom-2 right-3 text-[10px] tracking-wide transition-colors ${counterColor}`}>
              {newComment.length}/{MAX_CHARS}
            </span>
          </div>

          <div className="w-full pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none group w-full disabled:cursor-not-allowed">
              <input 
                type="checkbox"
                checked={isAnonymous}
                disabled={isSubmitting}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary/20 accent-primary cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors flex items-center gap-1.5 disabled:opacity-50">
                <EyeOff className="w-3.5 h-3.5 text-gray-400" /> Submeter como anónimo
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={newComment.length > MAX_CHARS || isSubmitting}
            className="w-full py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                A publicar...
              </>
            ) : (
              'Publicar Comentário'
            )}
          </button>
        </form>
      )}

      {/* Contentor de Rolagem dos Cartões de Feedback */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pr-1 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {orderedFeedbacks.length > 0 ? (
          orderedFeedbacks.map((fb) => (
            <FeedbackItem 
              key={fb.id} 
              fb={fb} 
              currentUserId={currentUserId} 
              maxChars={MAX_CHARS}
              isParentLoading={isSubmitting}
              onDelete={handleDelete}
              onUpdate={handleUpdateState}
            />
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-xs text-gray-400 italic">Ainda não existem comentários para esta disciplina.</p>
          </div>
        )}
      </div>

    </div>
  )
}

interface FeedbackItemProps {
  fb: Feedback
  currentUserId: string
  maxChars: number
  isParentLoading: boolean
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, comment: string, rating: number, isAnonymous: boolean) => Promise<void>
}

function FeedbackItem({ fb, currentUserId, maxChars, isParentLoading, onDelete, onUpdate }: FeedbackItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  
  const [editComment, setEditComment] = useState(fb.comment)
  const [editRating, setEditRating] = useState(fb.rating)
  const [editAnonymous, setEditAnonymous] = useState(fb.is_anonymous)
  
  const [isUpdating, setIsUpdating] = useState(false)
  
  const isOwner = currentUserId !== '' && fb.user_id === currentUserId
  const shouldMaskName = fb.is_anonymous && !isOwner
  const displayName = shouldMaskName ? 'Utilizador Anónimo' : (fb.profiles?.full_name ?? 'Utilizador Desconhecido')

  async function handleSave() {
    if (!editComment.trim() || editComment.length > maxChars || isUpdating) return
    
    setIsUpdating(true)
    try {
      await onUpdate(fb.id, editComment.trim(), editRating, editAnonymous)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar feedback:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleConfirmedDelete() {
    setIsUpdating(true)
    try {
      await onDelete(fb.id)
    } catch (error) {
      setIsConfirmingDelete(false) // Fecha a janela de confirmação em caso de falha controlada
    } finally {
      setIsUpdating(false)
    }
  }

  const editCharsLeft = maxChars - editComment.length
  const editCounterColor = editCharsLeft <= 50 ? 'text-red-500 font-bold' : editCharsLeft <= 100 ? 'text-orange-500 font-semibold' : 'text-gray-400'

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50 relative group/card shrink-0 w-full overflow-hidden transition-all">
      
      {/* Menu de Validação de Remoção do Cartão */}
      {isConfirmingDelete ? (
        <div className="flex flex-col gap-3 py-1 text-center animate-fadeIn">
          <div className="flex items-center justify-center gap-1.5 text-red-600 text-xs font-bold">
            <AlertCircle className="w-4 h-4" /> Quer apagar este feedback?
          </div>
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => setIsConfirmingDelete(false)} 
              disabled={isUpdating}
              className="px-3 py-1 bg-gray-200 text-gray-600 font-bold text-[11px] rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirmedDelete}
              disabled={isUpdating}
              className="px-3 py-1 bg-red-600 text-white font-bold text-[11px] rounded-md hover:bg-red-700 shadow-sm flex items-center justify-center gap-1 transition-colors disabled:opacity-50 min-w-[55px]"
            >
              {isUpdating ? (
                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Sim, apagar'
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Menu de Operações do Proprietário do Registo */}
          {isOwner && !isEditing && (
            <div className={`absolute top-3 right-3 flex gap-2 transition-opacity ${isParentLoading ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover/card:opacity-100'}`}>
              <button onClick={() => setIsEditing(true)} aria-label="Editar" className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Edit2 className="w-3 h-3" />
              </button>
              <button onClick={() => setIsConfirmingDelete(true)} aria-label="Apagar" className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Dados e Identificação Visual do Utilizador */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-maroon-50 text-primary rounded-full flex items-center justify-center font-bold text-xs border border-maroon-100 shrink-0 select-none">
              {shouldMaskName || !fb.profiles?.full_name ? <User className="w-4 h-4" /> : fb.profiles.full_name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-gray-800 leading-none mb-1 flex items-center gap-1.5 flex-wrap select-none">
                <span className="truncate max-w-[140px]">{displayName}</span>
                {fb.is_anonymous && isOwner && (
                  <span className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-normal flex items-center gap-0.5 shrink-0">
                    <EyeOff className="w-2 h-2" /> Anónimo para outros
                  </span>
                )}
              </div>
              
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={!isEditing || isUpdating}
                    onClick={() => setEditRating(star)}
                    className={`p-0.5 ${isEditing && !isUpdating ? 'cursor-pointer' : 'cursor-default'} disabled:opacity-50`}
                  >
                    <Star className={`w-3 h-3 ${(isEditing ? editRating : fb.rating) >= star ? 'fill-current' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Área do Formulário de Edição Ativa */}
          {isEditing ? (
            <div className="flex flex-col gap-2 mt-2 w-full">
              <div className="relative w-full">
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  maxLength={maxChars}
                  disabled={isUpdating}
                  rows={2}
                  className="w-full text-xs p-2 pb-6 rounded-md border border-gray-200 bg-white text-gray-800 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 resize-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
                <span className={`absolute bottom-1.5 right-2 text-[9px] tracking-wide transition-colors ${editCounterColor}`}>
                  {editComment.length}/{maxChars}
                </span>
              </div>
              
              <div className="flex justify-between items-center flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer select-none disabled:cursor-not-allowed">
                  <input 
                    type="checkbox"
                    checked={editAnonymous}
                    disabled={isUpdating}
                    onChange={(e) => setEditAnonymous(e.target.checked)}
                    className="w-3 h-3 rounded text-primary border-gray-300 focus:ring-primary/20 accent-primary disabled:cursor-not-allowed"
                  />
                  <span className="text-[10px] font-semibold text-gray-500 disabled:opacity-50">Permanecer anónimo</span>
                </label>

                <div className="flex gap-1.5">
                  <button 
                    onClick={() => { setIsEditing(false); setEditComment(fb.comment); setEditRating(fb.rating); setEditAnonymous(fb.is_anonymous); }} 
                    disabled={isUpdating}
                    aria-label="Cancelar edição"
                    className="p-1.5 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={handleSave} 
                    disabled={editComment.length > maxChars || isUpdating}
                    aria-label="Guardar edição"
                    className="p-1.5 rounded bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed min-w-[24px] flex items-center justify-center"
                  >
                    {isUpdating ? (
                      <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Visualização de Texto de Comentário Padrão */
            <p className="text-xs text-gray-600 leading-relaxed italic pr-2 break-words whitespace-pre-wrap">
              &quot;{fb.comment}&quot;
            </p>
          )}
        </>
      )}
    </div>
  )
}