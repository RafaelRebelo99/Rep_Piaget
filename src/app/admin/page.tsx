import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

interface Stat {
  label: string
  value: string
  badge: string
  badgeClass: string
  icon: React.ReactNode
}

import Link from 'next/link'

const stats: Stat[] = [
  {
    label: 'Total Utilizadores',
    value: '2,842',
    badge: '+12%',
    badgeClass: 'text-green-700 bg-green-50',
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Total Ficheiros',
    value: '15,903',
    badge: '+5%',
    badgeClass: 'text-green-700 bg-green-50',
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Ficheiros Pendentes',
    value: '142',
    badge: 'Crítico',
    badgeClass: 'text-red-700 bg-red-50',
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  {
    label: 'Support Tickets',
    value: '12',
    badge: 'Normal',
    badgeClass: 'text-gray-500 bg-gray-100',
    icon: (
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN') redirect('/')

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
            Visão Geral do Sistema
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Painel de Administração</h1>
        </div>

      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-6">
        {stats.map(({ label, value, badge, badgeClass, icon }: Stat) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-100 p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                {icon}
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${badgeClass}`}>
                {badge}
              </span>
            </div>
            <p className="text-sm text-gray-400 uppercase tracking-wide font-medium mb-2">{label}</p>
            <p className="text-4xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
