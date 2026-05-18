import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import DisciplinesSection from '@/components/DisciplinesSection'

export default async function CursoPage({ params }: { params: Promise<{ cursoId: string }> }) {
  const { cursoId } = await params
  const supabase = await createClient()

  const { data: curso } = await supabase
    .from('courses')
    .select('name, type')
    .eq('id', cursoId)
    .single()

  const { data: course_disciplines } = await supabase
    .from('course_disciplines')
    .select('*, discipline:disciplines(*, materials(count), feedbacks(count))')
    .eq('course_id', cursoId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6 text-center" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Cursos</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{curso?.name}</span>
        </nav>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">{curso?.name}</h1>

        <DisciplinesSection disciplines={course_disciplines ?? []} tipo={curso?.type} />


      </div>
    </div>
  )
}
