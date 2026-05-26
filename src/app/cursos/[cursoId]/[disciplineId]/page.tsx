import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import FeedbackSection from '@/components/FeedbackSection'
import MaterialsSection from '@/components/MaterialsSection'

export default async function UnidadeCurricularPage({
  params
}: {
  params: Promise<{ cursoId: string, disciplineId: string }>
}) {
  
  const { cursoId, disciplineId } = await params
  const supabase = await createClient()

  const { data: details, error } = await supabase
    .from('vw_course_structure')
    .select('*')
    .eq('course_id', cursoId)
    .eq('discipline_id', disciplineId)
    .single()

  if (error || !details) notFound()

  const { data: materials } = await supabase
    .from('vw_materials_detailed')
    .select('*')
    .eq('discipline_id', disciplineId)

  const { data: feedbacks } = await supabase
    .from('feedbacks')
    .select('*, profiles(full_name, role)')
    .eq('discipline_id', disciplineId)

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full">
        
        {/* Navegação Estrutural (Breadcrumbs) */}
        <nav className="text-xs text-gray-400 mb-6 text-center flex items-center justify-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Cursos</Link>
          <span className="text-gray-300">›</span>
          <Link href={`/cursos/${cursoId}`} className="hover:text-primary transition-colors">
            {details.course_name}
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-600 font-medium">{details.discipline_name}</span>
        </nav>
        
        {/* Cabeçalho de Identificação da Disciplina */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {details.discipline_name}
          </h1>
          <div className="flex justify-center gap-2">
            {details.year && (
              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                {details.year}º Ano
              </span>
            )}

            {details.semester && (
              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                {details.semester}º Semestre
              </span>
            )}
          </div>
        </header>

        {/* Grelha de Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Zona Central: Lista de Materiais com Pesquisa e Filtros */}
          <MaterialsSection materials={materials ?? []} disciplineName={details.discipline_name} />

          {/* Barra Lateral: Lista de Feedbacks e Comentários */}
          <aside className="lg:col-span-5">
            <FeedbackSection feedbacks={feedbacks ?? []} />
          </aside>
          
        </div>
      </main>
    </div>
  )
}