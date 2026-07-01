import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import UtilizadoresClient from './UtilizadoresClient'

export default async function UtilizadoresPage(): Promise<React.JSX.Element> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN') redirect('/')

  const { data: utilizadores } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, status, can_upload')
    .order('created_at', { ascending: false })

  return <UtilizadoresClient utilizadores={utilizadores ?? []} adminId={user.id} />
}

