import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ValidacaoClient from './ValidacaoClient'

export default async function ValidacaoPage(): Promise<React.JSX.Element> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN') redirect('/')

  // Buscar todos os ficheiros
  const { data: ficheiros } = await supabase
    .from('materials')
    .select(`id, title, file_type, file_size, created_at, user_id, status, discipline_id, disciplines(name), votes(value)`)
    .order('created_at', { ascending: false })

  // Buscar perfis dos utilizadores que submeteram
  const userIds = [...new Set((ficheiros ?? []).map((f) => f.user_id).filter(Boolean))]

  const { data: perfis } = userIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds)
    : { data: [] }

  // Mapear perfis por id
  const perfisMap = Object.fromEntries((perfis ?? []).map((p) => [p.id, p]))

  // Combinar ficheiros com perfis
  const ficheirosCombinados = (ficheiros ?? []).map((f) => {
    const discipline = Array.isArray(f.disciplines) ? f.disciplines[0] : f.disciplines

    return {
      ...f,
     status: (f.status === 'HIDDEN' ? 'HIDDEN' : 'VISIBLE') as 'VISIBLE' | 'HIDDEN',
      submittedBy: perfisMap[f.user_id] ?? null,
      disciplineName: discipline?.name ?? 'Sem disciplina',
    }
  })

  const { count: totalHidden } = await supabase
    .from('materials')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'HIDDEN')

  const { count: totalVisible } = await supabase
    .from('materials')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'VISIBLE')

  return (
    <ValidacaoClient
      ficheiros={ficheirosCombinados}
      adminId={user.id}
      totalHidden={totalHidden ?? 0}
      totalVisible={totalVisible ?? 0}
    />
  )
}