import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { MAX_SIZE_BYTES, ALLOWED_TYPES, ALLOWED_MIME_TYPES } from '@/utils/uploadConfig'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

     const { data: { user } } = await supabase.auth.getUser()
     if (!user) {
       return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
     }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const categoryId = formData.get('categoryId') as string
    const disciplineId = formData.get('disciplineId') as string
    const fileSize = parseInt(formData.get('fileSize') as string) || 0

    if (!file || !title.trim() || !categoryId || !disciplineId) {
      return NextResponse.json({ error: 'Dados em falta.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'O ficheiro excede o limite de 10MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_TYPES.includes(ext)) {
      return NextResponse.json({ error: 'Tipo de ficheiro não permitido.' }, { status: 400 })
    }

    if (ALLOWED_MIME_TYPES[ext] && file.type !== ALLOWED_MIME_TYPES[ext]) {
      return NextResponse.json({ error: 'Tipo de ficheiro não permitido.' }, { status: 400 })
    }

    const safeName = file.name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .toLowerCase()

    const filePath = `${disciplineId}/${Date.now()}-${safeName}`

    const { error: storageError } = await supabase.storage
      .from('materials')
      .upload(filePath, file)

    if (storageError) {
      console.log('Storage error:', storageError.message)
      return NextResponse.json({ error: storageError.message }, { status: 500 })
    }

    // Extração de texto e geração de embedding para PDFs
    let content: string | null = null
    let embedding: number[] | null = null
    if (ext === 'pdf') {
      const { extractTextFromPDF, generateEmbedding } = await import('@/utils/extractText')
      const buffer = Buffer.from(await file.arrayBuffer())
      const docs = await extractTextFromPDF(buffer)
      content = docs.map(doc => doc.pageContent).join('\n')
      embedding = await generateEmbedding(content)
    }

    const { error: dbError } = await supabase.from('materials').insert({
      discipline_id: disciplineId,
      user_id: user.id,
      category_id: categoryId,
      title: title.trim(),
      file_path: filePath,
      file_type: ext.toUpperCase(),
      file_size: fileSize,
      content,
      embedding,
    })

    if (dbError) {
      console.log('DB error:', dbError.message)
      await supabase.storage.from('materials').remove([filePath])
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro inesperado.' }, { status: 500 })
  }
}
