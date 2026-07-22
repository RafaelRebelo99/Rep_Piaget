import Link from 'next/link'

const team = [
  { name: 'João Neves',    email: '2022103671@ipiaget.pt', linkedin: 'https://www.linkedin.com/in/joao-neves-20593a286/', github: 'https://github.com/joaofcn7' },
  { name: 'Rafael Rebelo', email: '2022105439@ipiaget.pt', linkedin: 'https://www.linkedin.com/in/rafael-rebelo-0a24b9292/', github: 'https://github.com/RafaelRebelo99' },
  { name: 'Rodrigo Pires', email: '2022116589@ipiaget.pt', linkedin: 'https://www.linkedin.com/in/rodrigo-pires-b8352b306/', github: 'https://github.com/RodriPires' },
  { name: 'Yurma Afonso',  email: '2022115665@ipiaget.pt', linkedin: '', github: 'https://github.com/yurma96' },
]

export default function ContactosPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-2">Contactos</h1>
          <p className="text-sm text-gray-400">Equipa de desenvolvimento do REP</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {team.map((member) => (
            <div key={member.email} className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-1">{member.name}</p>
              <a
                href={`mailto:${member.email}`}
                className="text-xs text-gray-400 hover:text-primary transition-colors break-all"
              >
                {member.email}
              </a>
              <div className="flex gap-3 mt-1">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.869 0-2.155 1.46-2.155 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.608v5.588z"/>
                    </svg>
                  </a>
                )}
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-4">
            Encontrou um problema na plataforma? Use o formulário de suporte.
          </p>
          <Link
            href="/suporte"
            className="inline-block bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Ir para o Suporte
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
          >
            ← Voltar ao início
          </Link>
        </div>

      </div>
    </main>
  )
}
