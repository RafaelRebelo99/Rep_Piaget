import Link from 'next/link'

const sections = [
  {
    title: 'Sobre a Plataforma',
    content:
      'O REP (Repositório Educativo do Piaget) é uma plataforma académica desenvolvida no âmbito de um projeto integrador do Instituto Piaget. O seu objetivo é centralizar e partilhar materiais de estudo entre estudantes e docentes da instituição.',
  },
  {
    title: 'Acesso e Elegibilidade',
    content:
      'O acesso à plataforma é restrito a membros da comunidade académica do Instituto Piaget. O registo requer um endereço de email institucional válido (@ipiaget.pt). O utilizador é responsável pela confidencialidade das suas credenciais de acesso.',
  },
  {
    title: 'Conteúdos e Propriedade Intelectual',
    content:
      'Os materiais carregados na plataforma são da responsabilidade de quem os publica. Ao carregar um ficheiro, o utilizador confirma que tem autorização para o partilhar. A equipa REP reserva-se o direito de remover conteúdos que violem direitos de autor ou as normas da instituição.',
  },
  {
    title: 'Utilização Aceitável',
    content:
      'A plataforma destina-se exclusivamente a fins académicos. É proibida a publicação de conteúdos ofensivos, ilegais ou não relacionados com as disciplinas disponíveis. O uso abusivo das funcionalidades de inteligência artificial (chatbot e gerador de quizzes) poderá resultar na suspensão do acesso.',
  },
  {
    title: 'Dados Pessoais',
    content:
      'Os dados recolhidos (email, nome e histórico de atividade) são utilizados exclusivamente para o funcionamento da plataforma e não são partilhados com terceiros. Os dados são armazenados em servidores seguros através do Supabase e processados em conformidade com o RGPD.',
  },
  {
    title: 'Disponibilidade',
    content:
      'A plataforma é disponibilizada sem garantias de uptime contínuo, uma vez que se trata de um projeto académico em desenvolvimento. A equipa não se responsabiliza por perdas resultantes de indisponibilidade temporária do serviço.',
  },
  {
    title: 'Alterações aos Termos',
    content:
      'Estes termos podem ser atualizados sem aviso prévio. A utilização continuada da plataforma após qualquer alteração implica a aceitação dos novos termos.',
  },
]

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-2">Termos de Utilização</h1>
          <p className="text-sm text-gray-400">Última atualização: Julho de 2026</p>
        </div>

        <div className="flex flex-col gap-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                {i + 1}. {section.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">{section.content}</p>
            </div>
          ))}
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
