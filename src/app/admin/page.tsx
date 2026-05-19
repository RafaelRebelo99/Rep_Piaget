'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const icon = (path: React.ReactNode) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    {path}
  </svg>
)

const icons = {
  dashboard: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />),
  users: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 2a3 3 0 100-6" />),
  book: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />),
  file: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3h7l5 5v13H7V3zm7 0v5h5" />),
  logs: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />),
  check: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />),
  x: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />),
  plus: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />),
  edit: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 20h4l10.5-10.5a2.5 2.5 0 00-3.536-3.536L4 16.5V20z" />),
  logout: icon(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H9m4 8H5a2 2 0 01-2-2V6a2 2 0 012-2h8" />),
}

type AdminData = {
  admin: {
    name: string
    email: string
    role: string
  }
  stats: {
    totalUsers: number
    totalFiles: number
    pendingFiles: number
    supportTickets: number
  }
  disciplines: Array<{
    id: string
    name?: string
  }>
  logs: Array<{
    id?: string
    created_at?: string
    action?: string
    event?: string
  }>
}

export default function AdminPage() {
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAdmin() {
      try {
        const response = await fetch('/api/admin')
        const json = await response.json().catch(() => null)

        if (!response.ok) {
          setError(json?.error || 'Acesso negado.')
          return
        }

        setData(json)
      } catch {
        setError('Erro ao carregar painel.')
      } finally {
        setLoading(false)
      }
    }

    loadAdmin()
  }, [])

  if (loading) {
    return <main className="min-h-screen bg-[#f5f6f8] p-8">A carregar painel...</main>
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-4">
        <section className="rounded-lg bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#071426]">Sem acesso</h1>
          <p className="mt-2 text-sm text-[#6b7280]">{error}</p>
          <button
            onClick={() => router.push('/entrar')}
            className="mt-6 h-10 rounded-md bg-[#87001f] px-5 text-sm font-bold text-white"
          >
            Voltar ao login
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#111827]">
      <aside className="fixed left-0 top-0 flex h-screen w-[190px] flex-col border-r border-[#e7dde1] bg-white">
        <div className="px-4 py-4">
          <h1 className="text-sm font-black text-[#87001f]">REP Scholar Hub</h1>
          <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.22em] text-[#8b5c68]">Admin Console</p>
        </div>

        <nav className="mt-5 space-y-1 text-[11px] font-semibold uppercase">
          <MenuItem active icon={icons.dashboard} label="Dashboard" />
          <MenuItem icon={icons.users} label="Utilizadores" />
          <MenuItem icon={icons.book} label="Disciplinas" />
          <MenuItem icon={icons.file} label="Moderação" />
          <MenuItem icon={icons.logs} label="Logs do Sistema" />
        </nav>

        <div className="mt-auto border-t border-[#e7dde1] p-4">
          <p className="text-xs font-bold text-[#071426]">{data?.admin.name || 'Administrador'}</p>
          <p className="text-[10px] text-[#7a5f6b]">Administrador Sénior</p>

          <button className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#87001f] text-xs font-bold text-white">
            {icons.logout}
            Sair do Sistema
          </button>
        </div>
      </aside>

      <section className="ml-[190px]">
        <header className="flex h-[38px] items-center justify-between bg-white px-6 shadow-sm">
          <h2 className="text-lg font-bold">Painel de Administração</h2>
          <p className="text-xs text-[#4b5563]">24 Mai, 2024</p>
        </header>

        <div className="grid grid-cols-[1fr_225px] gap-6 px-6 py-6">
          <div>
            <section className="grid grid-cols-4 gap-4">
              <Stat title="Total Utilizadores" value={data?.stats.totalUsers ?? 0} subtitle="+12% este mês" icon={icons.users} />
              <Stat title="Total Ficheiros" value={data?.stats.totalFiles ?? 0} subtitle="Sincronizado" icon={icons.file} />
              <Stat title="Ficheiros Pendentes" value={data?.stats.pendingFiles ?? 0} subtitle="Requer atenção" icon={icons.logs} highlight />
              <Stat title="Support Tickets" value={data?.stats.supportTickets ?? 0} subtitle="3 urgentes" icon={icons.dashboard} />
            </section>

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-black">Moderação de Ficheiros (UC12)</h3>
                <button className="text-xs font-bold text-[#87001f]">Ver todos →</button>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fafafa] text-[9px] uppercase tracking-[0.18em] text-[#8b5c68]">
                    <tr>
                      <th className="px-5 py-4">Ficheiro</th>
                      <th>Autor</th>
                      <th>Disciplina</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee]">
                    {[
                      ['Apontamentos_Termo_V1.pdf', 'Ricardo Antunes', 'ENG. MECÂNICA'],
                      ['Estruturas_Betão_Slides.zip', 'Margarida Santos', 'ENG. CIVIL'],
                      ['Lab_Redes_Protocolo.docx', 'João Pereira', 'ENG. INFORMÁTICA'],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="px-5 py-4 font-semibold">{row[0]}</td>
                        <td className="text-[#8b5c68]">{row[1]}</td>
                        <td>
                          <span className="rounded-md bg-[#fde7ea] px-2 py-1 text-[9px] font-bold text-[#87001f]">{row[2]}</span>
                        </td>
                        <td>
                          <div className="flex gap-4">
                            <span className="text-emerald-600">{icons.check}</span>
                            <span className="text-red-600">{icons.x}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b5c68]">Disciplinas Ativas</h3>
                <span className="text-[#87001f]">{icons.plus}</span>
              </div>

              <div className="space-y-2">
                {(data?.disciplines ?? []).map((discipline) => (
                  <div key={discipline.id} className="flex items-center justify-between rounded-md bg-[#f7f7f8] px-3 py-3 text-xs">
                    {discipline.name || 'Disciplina'}
                    <span className="text-[#8b5c68]">{icons.edit}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-[#970020] p-5 text-white shadow-lg">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-black">
                {icons.logs}
                Logs do Sistema (UC13)
              </h3>

              <div className="space-y-4 font-mono text-[10px] font-bold">
                {(data?.logs ?? []).slice(0, 4).map((log, index) => (
                  <p key={log.id || index}>
                    [{String(log.created_at || '').slice(11, 16) || '--:--'}] {log.action || log.event || 'Evento registado'}
                  </p>
                ))}
              </div>

              <button className="mt-6 h-8 w-full rounded-md bg-[#520011] text-[10px] font-black uppercase">
                Descarregar Log Full
              </button>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

function MenuItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
        active ? 'border-r-4 border-[#87001f] bg-[#f3eef0] text-[#87001f]' : 'text-[#6b7280]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function Stat({
  title,
  value,
  subtitle,
  icon,
  highlight,
}: {
  title: string
  value: number
  subtitle: string
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <article className={`rounded-lg bg-white p-5 shadow-sm ${highlight ? 'border-b-2 border-[#c59aa5]' : ''}`}>
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b5c68]">{title}</p>
        <div className="rounded-md bg-[#f8eef1] p-2 text-[#87001f]">{icon}</div>
      </div>

      <p className="mt-6 text-2xl font-black text-[#071426]">{value.toLocaleString('pt-PT')}</p>
      <p className="mt-1 text-[10px] font-bold text-[#87001f]">{subtitle}</p>
    </article>
  )
}
