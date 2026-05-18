import Link from 'next/link'
import { Computer } from 'lucide-react'

interface Props {
  id: string
  name: string
  type: string
  description: string
  totalDisciplines: number
  duration: string
  ects: number
}

export default function FeaturedCourseCard({ id, name, type, description, totalDisciplines, duration, ects }: Props) {
  return (
    <Link href={`/cursos/${id}`} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col md:flex-row gap-6 items-center">
      <div className="w-40 h-32 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 text-primary">
        <Computer className="w-12 h-12" />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <span className="text-xs font-semibold text-primary bg-red-50 px-2 py-1 rounded-full w-fit">{type}</span>
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <p className="text-gray-500 text-sm">{description}</p>
        <div className="flex gap-6 mt-2">
          <div>
            <p className="text-xs text-gray-400 uppercase">Disciplinas</p>
            <p className="font-bold text-gray-800">{totalDisciplines}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Duração</p>
            <p className="font-bold text-gray-800">{duration}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">ECTS</p>
            <p className="font-bold text-gray-800">{ects}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
