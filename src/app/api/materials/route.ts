import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['pdf', 'docx', 'doc', 'pptx', 'xlsx']

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) {
    //   return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    // }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const categoryId = formData.get('categoryId') as string
    const disciplineId = formData.get('disciplineId') as string

    if (!file || !title || !categoryId || !disciplineId) {
      return NextResponse.json({ error: 'Dados em falta.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'O ficheiro excede o limite de 10MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_TYPES.includes(ext)) {
      return NextResponse.json({ error: 'Tipo de ficheiro não permitido.' }, { status: 400 })
    }

    const filePath = `${disciplineId}/${Date.now()}-${file.name}`

    const { error: storageError } = await supabase.storage
      .from('materials')
      .upload(filePath, file)

    if (storageError) {
      console.log('Storage error:', storageError.message)
      return NextResponse.json({ error: storageError.message }, { status: 500 })
    }

    const { error: dbError } = await supabase.from('materials').insert({
      discipline_id: disciplineId,
      user_id: '37587d5f-a109-4d98-8915-bc3877f0896e', // Substituir pelo ID do utilizador autenticado
      category_id: categoryId,
      title: title.trim(),
      file_path: filePath,
      file_type: ext.toUpperCase(),
      file_size: file.size,
      status: 'PENDING',
    })

    if (dbError) {
      console.log('DB error:', dbError.message)
      await supabase.storage.from('materials').remove([filePath])
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro inesperado.' }, { status: 500 })
  }
}
