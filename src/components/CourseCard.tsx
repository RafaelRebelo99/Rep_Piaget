import Link from 'next/link'
import { Shield, BracesIcon, Cloud, Gamepad, Cpu, Palette, BookOpen } from 'lucide-react'

const courseIcons: Record<string, React.ReactNode> = {
  'Cibersegurança': <Shield className="w-5 h-5" />,
  'Programação em Web, Dispositivos e Aplicações Móveis': <BracesIcon className="w-5 h-5" />,
  'Infraestruturas Cloud, Redes e Datacenter': <Cloud className="w-5 h-5" />,
  'Desenvolvimento de Videojogos e Aplicações Multimédia': <Gamepad className="w-5 h-5" />,
  'Animação e Desenho Digital': <Palette className="w-5 h-5" />,
  'Eletrónica e Automação': <Cpu className="w-5 h-5" />,
}

interface Props {
  id: string
  name: string
  type: string
  totalDisciplines: number
}

export default function CourseCard({ id, name, type, totalDisciplines }: Props) {
  const icon = courseIcons[name] ?? <BookOpen className="w-5 h-5" />

  return (
    <Link href={`/cursos/${id}`} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-primary mb-3 shrink-0">
        {icon}
      </div>
      <span className="text-xs font-semibold text-primary bg-red-50 px-2 py-1 rounded-full w-fit">{type}</span>
      <h3 className="font-bold text-gray-800 mt-2 mb-1">{name}</h3>
      <p className="text-sm text-gray-400 mt-auto pt-2">{totalDisciplines} Disciplinas</p>
    </Link>
  )
}
