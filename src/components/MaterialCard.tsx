import { formatBytes, formatDate } from '@/utils/formatter'
import {
  FileText,
  Download,
  ThumbsUp,
  Image as ImageIcon,
  FileSpreadsheet,
  Presentation,
  FileCode,
  File,
  LucideIcon,
  ThumbsDown
} from 'lucide-react'

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

// Configuração de Ícones e Cores por Extensão
const fileTypeConfig: Record<string, { icon: LucideIcon, color: string, bg: string }> = {
  pdf: { icon: FileText, color: 'text-red-600', bg: 'bg-red-50' },
  docx: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  doc: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  pptx: { icon: Presentation, color: 'text-orange-600', bg: 'bg-orange-50' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50' },
  jpg: { icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
  png: { icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
  zip: { icon: FileCode, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  default: { icon: File, color: 'text-gray-600', bg: 'bg-gray-50' }
}

export default function MaterialCard({ material }: { material: Material }) {
  const config = fileTypeConfig[material.file_type?.toLowerCase()] || fileTypeConfig.default
  const Icon = config.icon

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
      
      {/* Secção Esquerda: Ícone do Ficheiro, Título e Metadados */}
      <div className="flex items-center gap-4">
        <div className={`${config.bg} p-3 rounded-lg transition-colors`}>
          <Icon className={`${config.color} w-6 h-6`} />
        </div>

        <div>
          <h4 className="font-bold text-gray-800">{material.title}</h4>
          <div className="flex gap-3 text-[10px] text-gray-400 font-bold uppercase mt-1">
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

      {/* Secção Direita: Sistema de Votação (Score) e Botão de Download */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 text-gray-400">
          <button type="button" aria-label="Gostar" className="p-1.5 rounded-lg hover:text-green-600 transition-colors">
            <ThumbsUp className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-gray-600 min-w-[20px] text-center">{material.score}</span>
          <button type="button" aria-label="Não Gostar" className="p-1.5 rounded-lg hover:text-primary transition-colors">
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
        <button className="bg-gray-50 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
          <Download className="w-5 h-5" />
        </button>
      </div>

    </div>
  )
}