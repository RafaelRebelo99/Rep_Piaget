'use client'

import { useState } from 'react'
import { Bot, PlusCircle } from 'lucide-react'
import MaterialCard, { Material } from './MaterialCard'
import SearchBar from './SearchBarDiscipline'
import UploadModal from './UploadModal'

// Incluir o status de forma opcional e segura
interface ExtendedMaterial extends Material {
  status?: 'VISIBLE' | 'HIDDEN' | string
}

// Interface
interface MaterialsSectionProps {
  materials: ExtendedMaterial[]
  disciplineName: string
  disciplineId: string
}

export default function MaterialsSection({ materials, disciplineName, disciplineId }: MaterialsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [visibleCount, setVisibleCount] = useState<number>(10)
  const [modalOpen, setModalOpen] = useState(false)

  // Extração de Categorias Únicas para os Filtros
  const categories = ['all', ...Array.from(new Set(materials.map(m => m.category_name)))]

  const filteredMaterials = materials.filter((mat) => {
    if (mat.status === 'HIDDEN') return false

    const matchesCategory = selectedCategory === 'all' || mat.category_name === selectedCategory
    const matchesSearch = mat.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="lg:col-span-7">

      {/* Barra de Pesquisa */}
      <div className="mb-8">
        <SearchBar
          placeholder={`Pesquisar em ${disciplineName}...`}
          onSearch={(value) => {
            setSearchQuery(value)
            setVisibleCount(10)
          }}
        />
      </div>

      {/* Cabeçalho do Repositório */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Repositório</h2>
        <div className="flex gap-4 items-center">
          <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95">
            <Bot className="w-4 h-4" /> Gerar Quizz
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="text-primary hover:text-primary-dark text-xs font-bold flex items-center gap-1.5 transition-colors group"
          >
            <PlusCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
            Contribuir
          </button>
        </div>
      </div>

      {/* Barra de Filtros por Categoria */}
      {materials.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 pb-2 border-b border-gray-100">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setVisibleCount(10)
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>
      )}

      {/* Lista de Cartões com Limite de Exibição */}
      <div className="space-y-4">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.slice(0, visibleCount).map((mat) => (
            <MaterialCard key={mat.material_id} material={mat} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
            Nenhum material encontrado com os filtros aplicados.
          </div>
        )}
      </div>

      {/* Botão para Carregar Mais Materiais */}
      {filteredMaterials.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 10)}
          className="w-full mt-8 py-3 bg-gray-100 text-primary rounded-xl text-xs font-bold hover:bg-gray-100 hover:text-gray-700 transition-all border border-transparent hover:border-gray-200"
        >
          Carregar mais materiais
        </button>
      )}

      {modalOpen && (
        <UploadModal
          disciplineId={disciplineId}
          disciplineName={disciplineName}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  )
}
