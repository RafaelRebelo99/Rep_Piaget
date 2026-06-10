'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, PlusCircle, Edit2, Trash2, AlertCircle } from 'lucide-react'
import { useMaterials, ExtendedMaterial, Category } from '@/utils/useMaterials'
import { useGlobalError } from '@/utils/errorContext'
import MaterialCard from './MaterialCard'
import SearchBar from './SearchBarDiscipline'
import UploadModal from './UploadModal'
import QuizModal from './QuizModal'

// Interface
interface MaterialsSectionProps {
  materials: ExtendedMaterial[]
  disciplineName: string
  disciplineId: string
}

export default function MaterialsSection({ materials: initialMaterials, disciplineName, disciplineId }: MaterialsSectionProps) {
  const { 
    materials, categories, currentUserId, isSubmitting, deleteMaterial, updateMaterial 
  } = useMaterials(initialMaterials)

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [visibleCount, setVisibleCount] = useState<number>(10)
  const [modalOpen, setModalOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)

  // Extração de Categorias
  const filterCategories = ['all', ...Array.from(new Set(materials.map(m => m.category_name)))]

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
          <button
            onClick={() => setQuizOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95">
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
          {filterCategories.map((category) => (
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
            <EditableMaterialWrapper
              key={mat.material_id}
              mat={mat}
              currentUserId={currentUserId}
              allSystemCategories={categories}
              isParentLoading={isSubmitting}
              onDelete={deleteMaterial}
              onUpdate={updateMaterial}
            />
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
          preloadedCategories={categories}
          onClose={() => setModalOpen(false)}
        />
      )}

      {quizOpen && (
        <QuizModal
          disciplineName={disciplineName}
          materials={materials}
          onClose={() => setQuizOpen(false)}
        />
      )}
    </section>
  )
}

// Subcomponente de controlo de permissões inline para cada cartão de material
interface EditableWrapperProps {
  mat: ExtendedMaterial
  currentUserId: string
  allSystemCategories: Category[]
  isParentLoading: boolean
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, title: string, categoryId: string) => Promise<void>
}

function EditableMaterialWrapper({ mat, currentUserId, allSystemCategories, isParentLoading, onDelete, onUpdate }: EditableWrapperProps) {
  const { showError } = useGlobalError()
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [editTitle, setEditTitle] = useState(mat.title)
  const [editCategoryId, setEditCategoryId] = useState(mat.category_id || '')
  const [isUpdating, setIsUpdating] = useState(false)

  const inputInputRef = useRef<HTMLInputElement>(null)
  const isOwner = currentUserId !== '' && mat.user_id === currentUserId

  useEffect(() => {
    if (isEditing) {
      setEditTitle(mat.title)
      setEditCategoryId(mat.category_id || allSystemCategories[0]?.id || '')
      
      setTimeout(() => {
        inputInputRef.current?.focus()
        inputInputRef.current?.select()
      }, 50)
    }
  }, [isEditing, mat.title, mat.category_id, allSystemCategories])

  async function handleSave() {
    if (!editTitle.trim() || !editCategoryId || isUpdating) return
    setIsUpdating(true)
    try {
      await onUpdate(mat.material_id, editTitle.trim(), editCategoryId)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar material:', error)
      showError('Ocorreu uma falha ao tentar atualizar os dados do ficheiro no servidor.', 'Erro ao Guardar')
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleConfirmedDelete() {
    setIsUpdating(true)
    try {
      await onDelete(mat.material_id)
    } catch (error) {
      console.error('Erro ao apagar material:', error)
      setIsConfirmingDelete(false)
      showError('Não foi possível remover este material do repositório.', 'Erro ao Eliminar')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="w-full">
      {isConfirmingDelete ? (
        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold select-none">
            <AlertCircle className="w-4 h-4" /> Eliminar permanentemente este ficheiro do repositório?
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsConfirmingDelete(false)} 
              disabled={isUpdating}
              className="px-3 py-1 bg-gray-100 text-gray-600 font-bold text-[11px] rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirmedDelete}
              disabled={isUpdating}
              className="px-3 py-1 bg-red-600 text-white font-bold text-[11px] rounded-md hover:bg-red-700 shadow-sm flex items-center justify-center gap-1 transition-colors min-w-[65px]"
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
      ) : isEditing ? (
        <div className="bg-white p-5 rounded-xl border border-primary/20 shadow-md flex flex-col gap-4 animate-fadeIn w-full box-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <div className="sm:col-span-2 min-w-0">
              <input
                ref={inputInputRef}
                type="text"
                value={editTitle}
                disabled={isUpdating}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none focus:border-primary/40 bg-white box-border truncate"
                placeholder="Título do material"
              />
            </div>
            <div className="min-w-0">
              <select
                value={editCategoryId}
                disabled={isUpdating}
                onChange={(e) => setEditCategoryId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-200 outline-none focus:border-primary/40 bg-white capitalize box-border"
              >
                {allSystemCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-50 pt-2">
            <button 
              onClick={() => setIsEditing(false)} 
              disabled={isUpdating}
              className="p-1.5 px-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-xs font-semibold"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave} 
              disabled={!editTitle.trim() || !editCategoryId || isUpdating}
              className="p-1.5 px-4 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all min-w-[60px] flex items-center justify-center text-xs font-semibold shadow-xs"
            >
              {isUpdating ? (
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Visual Efeito Hover para Apagar e Editar */
        <div className="relative w-full flex items-stretch group/card rounded-xl overflow-hidden border border-gray-100 bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-primary-dark/30">
          {isOwner && (
            <div className="relative z-20 flex flex-col items-center justify-center bg-primary-dark text-white w-2 group-hover/card:w-12 transition-all duration-300 ease-out shrink-0 select-none">
              
              <div className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-250 flex flex-col gap-2.5 items-center justify-center w-full max-h-[70px] h-full">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-white/15 rounded-md text-white/90 hover:text-white transition-all active:scale-75 cursor-pointer flex items-center justify-center"
                  title="Editar Nome/Categoria"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-4 h-[1px] bg-white/20 shrink-0" />
                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="p-1 hover:bg-red-600/30 rounded-md text-white/90 hover:text-red-200 transition-all active:scale-75 cursor-pointer flex items-center justify-center"
                  title="Apagar Material"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}
          <div className={`flex-1 min-w-0 [&>div]:border-none ${isOwner ? '[&>div]:rounded-l-none' : ''}`}>
            <MaterialCard material={mat} hideActions={isParentLoading} />
          </div>
        </div>
      )}
    </div>
  )
}
