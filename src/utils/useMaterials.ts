'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Material } from '@/components/MaterialCard'

// Incluir o status de forma opcional e segura
export interface ExtendedMaterial extends Material {
  status?: 'VISIBLE' | 'HIDDEN' | string
  user_id?: string // Identificador do proprietário do material
  category_id?: string // Garantir o ID original vindo da View
  user_name?: string | null
  discipline_name?: string | null
  description?: string | null
}

export interface Category {
  id: string
  name: string
}

export function useMaterials(initialMaterials: ExtendedMaterial[]) {
  const supabase = createClient()
  
  const [materials, setMaterials] = useState<ExtendedMaterial[]>(initialMaterials)
  const [categories, setCategories] = useState<Category[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sincronizar estado com propriedades iniciais
  useEffect(() => {
    setMaterials(initialMaterials)
  }, [initialMaterials])

  // Obter o ID do utilizador autenticado e as categorias do sistema
  useEffect(() => {
    async function initSessionAndData() {
      const [{ data: authData }, { data: catData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('material_categories').select('id, name')
      ])
      
      if (authData?.user) setCurrentUserId(authData.user.id)
      if (catData) setCategories(catData)
    }
    initSessionAndData()
  }, [supabase])

  // Lógica de remoção física/lógica do material
  async function deleteMaterial(id: string) {
    setIsSubmitting(true)
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUserId)

    if (error) {
      console.error('Erro ao apagar material:', error.message)
      setIsSubmitting(false)
      throw error
    }

    setMaterials(prev => prev.filter(mat => mat.material_id !== id))
    setIsSubmitting(false)
  }

  // Lógica de atualização cadastral do material
  async function updateMaterial(id: string, updatedTitle: string, updatedCategoryId: string) {
    const { error } = await supabase
      .from('materials')
      .update({
        title: updatedTitle,
        category_id: updatedCategoryId
      })
      .eq('id', id)
      .eq('user_id', currentUserId)

    if (error) {
      console.error('Erro ao atualizar material:', error.message)
      throw error
    }

    // Descobrir o nome de texto correspondente ao ID para atualizar a UI local
    const categoryObj = categories.find(c => c.id === updatedCategoryId)
    const updatedCategoryName = categoryObj ? categoryObj.name : 'Outros'

    setMaterials(prev => prev.map(mat => 
      mat.material_id === id ? { ...mat, title: updatedTitle, category_name: updatedCategoryName, category_id: updatedCategoryId } : mat
    ))
  }

  return {
    materials,
    categories,
    currentUserId,
    isSubmitting,
    deleteMaterial,
    updateMaterial
  }
}
