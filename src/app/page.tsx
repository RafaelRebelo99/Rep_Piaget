'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import SearchBar from '@/components/SearchBar'
import FeaturedCourseCard from '@/components/FeaturedCourseCard'
import CourseCard from '@/components/CourseCard'
import SuggestCourseCard from '@/components/SuggestCourseCard'

type Course = {
  id: string
  name: string
  type: string
  description: string
  campus: string
  course_disciplines: { count: number }[]
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('courses').select('*, course_disciplines(count)')
      setCourses(data ?? [])
    }
    fetchCourses()
  }, [])

  const licenciaturas = courses.filter(c =>
    c.type === 'LICENCIATURA' &&
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  const ctesps = courses.filter(c =>
    c.type === 'CTESP' &&
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center">Explorar Cursos</h1>

      <div className="flex justify-center">
        <SearchBar onSearch={(q) => setSearch(q)} />
      </div>

      {/* Licenciaturas */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-bold">Licenciatura</h2>
        </div>
        <span className="hidden sm:block text-sm text-gray-400 uppercase tracking-widest">Ensino Superior</span>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          {licenciaturas[0] && (
            <FeaturedCourseCard
              id={licenciaturas[0].id}
              name={licenciaturas[0].name}
              type={licenciaturas[0].type}
              description={licenciaturas[0].description ?? ''}
              totalDisciplines={licenciaturas[0].course_disciplines[0]?.count ?? 0}
              duration="3 Anos"
              ects={180}
            />
          )}
        </div>
        <div className="w-full md:w-64">
          <SuggestCourseCard />
        </div>
      </div>

      {/* CTeSP */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-bold">CTeSP</h2>
        </div>
        <span className="hidden sm:block text-sm text-gray-400 uppercase tracking-widest">Técnico Superior Profissional</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ctesps.map(course => (
          <CourseCard
            key={course.id}
            id={course.id}
            name={course.name}
            type={course.type}
            totalDisciplines={course.course_disciplines[0]?.count ?? 0}
          />
        ))}
        <SuggestCourseCard />
      </div>
    </div>
  )
}
