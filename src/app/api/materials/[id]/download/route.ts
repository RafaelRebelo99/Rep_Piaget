import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Para fazer o download do material, é necessário estar autenticado.' },
        { status: 401 }
      )
    }

    const { data: material, error: materialError } = await supabase
      .from('materials')
      .select('id, title, file_path, file_type, status')
      .eq('id', id)
      .eq('status', 'VISIBLE')
      .single()

    if (materialError || !material) {
      return NextResponse.json(
        { error: 'Material não encontrado ou indisponível para download.' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase.storage
      .from('materials')
      .createSignedUrl(material.file_path, 60)

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: 'Não foi possível gerar o download.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      downloadUrl: data.signedUrl,
      title: material.title,
      fileType: material.file_type,
    })
  } catch (err) {
    console.error('Erro ao gerar download:', err)

    return NextResponse.json(
      { error: 'Erro inesperado ao gerar download.' },
      { status: 500 }
    )
  }
}