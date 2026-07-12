'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatBytes, formatDate } from '@/utils/formatter'
import {
  FileText,
  Download,
  Heart,
  ThumbsUp,
  FileSpreadsheet,
  Presentation,
  FileCode,
  File,
  LucideIcon,
  ThumbsDown,
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react'

// Interface de Tipagem
export interface Material {
  material_id: string;
  title: string;
  file_size: number;
  category_name: string;
  score: number;
  file_type: string;
  created_at: string;
  file_path?: string;
}

interface MaterialCardProps {
  material: Material;
  hideActions?: boolean;
  actions?: React.ReactNode;
  onDownload?: () => void;
  isDownloading?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const fileTypeConfig: Record<string, { icon: LucideIcon, color: string, bg: string }> = {
  pdf: { icon: FileText, color: 'text-red-600', bg: 'bg-red-50' },
  docx: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  doc: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  pptx: { icon: Presentation, color: 'text-orange-600', bg: 'bg-orange-50' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50' },
  md: { icon: FileCode, color: 'text-gray-600', bg: 'bg-gray-50' },
  txt: { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-50' },
  default: { icon: File, color: 'text-gray-600', bg: 'bg-gray-50' }
}

export default function MaterialCard({ material, hideActions = false, actions, onDownload, isDownloading, isFavorite, onToggleFavorite }: MaterialCardProps) {
  const supabase = createClient()

  const [currentScore, setCurrentScore] = useState<number>(material.score)
  const [userVote, setUserVote] = useState<number | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [isVoting, setIsVoting] = useState<boolean>(false)
  const [isDismissed, setIsDismissed] = useState<boolean>(false)
  const config = fileTypeConfig[material.file_type?.toLowerCase()] || fileTypeConfig.default
  const Icon = config.icon

  // Score Real à tabela de votos
  const refreshMaterialData = async () => {
    const { data: sumData } = await supabase
      .from('votes')
      .select('value')
      .eq('material_id', material.material_id)

    if (sumData) {
      const totalScore = sumData.reduce((acc, curr) => acc + curr.value, 0)
      setCurrentScore(totalScore)
    }
  }

  // Carregamento do estado inicial do voto
  useEffect(() => {
    async function fetchUserVote() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      const { data, error } = await supabase
        .from('votes')
        .select('value')
        .eq('material_id', material.material_id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (!error && data) {
        setUserVote(data.value)
      }
    }
    fetchUserVote()
  }, [material.material_id, supabase])

  // Lógica principal de processamento do voto
  const handleVote = async (type: 'up' | 'down') => {
    if (!userId || isVoting) return

    setIsVoting(true)
    const clickedValue = type === 'up' ? 1 : -1
    let newVote: number | null = clickedValue

    if (userVote === clickedValue) {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('material_id', material.material_id)
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao remover o voto na BD:', error.message)
        setIsVoting(false)
        return
      }
      newVote = null
    } else {
      const { error } = await supabase
        .from('votes')
        .upsert({
          material_id: material.material_id,
          user_id: userId,
          value: clickedValue
        }, { onConflict: 'user_id,material_id' })

      if (error) {
        console.error('Erro ao registar o voto na BD:', error.message)
        setIsVoting(false)
        return
      }
    }

    setUserVote(newVote)
    await refreshMaterialData()
    setIsVoting(false)
  }

  if (isDismissed) return null

  // Secção Condicional: Ficheiro com Score Crítico (<= -5)
  if (currentScore <= -5) {
    return (
      <div className="bg-red-50/60 p-4 rounded-xl border border-red-100 flex items-center justify-between transition-all animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-lg text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-red-900 line-clamp-1">
              &quot;{material.title}&quot; foi ocultado
            </h4>
            <p className="text-[11px] text-red-600 font-medium mt-0.5">
              O ficheiro atingiu o limite de {currentScore} votos negativos comunitários.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userVote !== null && (
            <button
              type="button"
              onClick={() => handleVote(userVote === 1 ? 'up' : 'down')}
              disabled={isVoting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs font-bold text-red-700 hover:bg-red-100/50 hover:border-red-300 transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reverter Voto
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Confirmar e manter ocultação"
            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors active:scale-95"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Visualização Padrão do Material
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className={`${config.bg} p-3 rounded-lg transition-colors shrink-0`}>
          <Icon className={`${config.color} w-6 h-6`} />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-gray-800 truncate pr-4 break-words">{material.title}</h4>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400 font-bold uppercase mt-1">
            <span>{formatBytes(material.file_size)}</span>
            <span>•</span>
            <span className={config.color}>{material.file_type}</span>
            <span>•</span>
            <span className="text-gray-500">{formatDate(material.created_at)}</span>
            <span>•</span>
            <span className="text-primary-dark">{material.category_name}</span>
          </div>
        </div>
      </div>
{/* Secção Direita: Sistema de Votação Dinâmico e Botão de Download */}
      <div className={`flex items-center justify-between sm:justify-end gap-4 select-none shrink-0 transition-opacity duration-200 ${hideActions ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-1 text-gray-400">
          <button 
            type="button" 
            aria-label="Gostar" 
            onClick={() => handleVote('up')}
            disabled={isVoting || !userId}
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              userVote === 1 ? 'text-green-600 bg-green-50' : 'hover:text-green-600'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>

          <span className={`text-sm font-bold min-w-[20px] text-center transition-colors ${
            currentScore > 0 ? 'text-green-600' : currentScore < 0 ? 'text-red-500' : 'text-gray-600'
          }`}>
            {currentScore}
          </span>

          <button
            type="button"
            aria-label="Não Gostar"
            onClick={() => handleVote('down')}
            disabled={isVoting || !userId}
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              userVote === -1 ? 'text-red-500 bg-red-50' : 'hover:text-primary'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite?.()}
          disabled={hideActions}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={`bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          isFavorite
            ? 'text-red-500 hover:text-red-600'
            : 'text-gray-400 hover:text-red-500'
        }`}
      >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      <button
        type="button"
        onClick={() => onDownload?.()}
        disabled={isDownloading}
        aria-label="Download"
        title="Download"
        className="bg-gray-50 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
    <Download className="w-5 h-5" />
    </button>
    {actions}
      
      </div>
    </div>
  )
}
