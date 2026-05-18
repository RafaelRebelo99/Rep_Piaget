'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import DisciplineCard from '@/components/DisciplineCard'

interface Discipline {
  id: string
  name: string
}

interface CourseDiscipline {
  discipline_id: string
  year: number
  semester: number
  discipline: Discipline
}

interface Props {
  disciplines: CourseDiscipline[]
  tipo?: string
}

const normalize = (str: string) =>
  str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function DisciplinesSection({ disciplines, tipo }: Props) {
  const anos = tipo === 'CTESP' ? [1, 2] : [1, 2, 3]
  const [query, setQuery] = useState('')
  const [ano, setAno] = useState<number | null>(null)

  const filtered = disciplines
    .filter((cd) =>
      (ano === null || cd.year === ano) &&
      normalize(cd.discipline.name).includes(normalize(query))
    )
    .sort((a, b) => a.year - b.year)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <SearchBar placeholder="Explorar disciplinas..." onSearch={setQuery} />
      </div>

      {/* Filtros de ano */}
      <div className="flex justify-center gap-2">
        {anos.map((a) => (
          <button
            key={a}
            onClick={() => setAno(a)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              ano === a
                ? 'bg-primary text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {a}º Ano
          </button>
        ))}
        <button
          onClick={() => setAno(null)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            ano === null
              ? 'bg-primary text-white'
              : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Todas
        </button>
      </div>


      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((cd) => (
            <DisciplineCard key={cd.discipline_id} discipline={cd.discipline} year={cd.year} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-400 text-sm py-10">Nenhuma disciplina encontrada.</p>
        )}
      </div>
    </div>
  )
}
