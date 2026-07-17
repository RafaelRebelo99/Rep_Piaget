'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

interface DisciplineCardProps {
  discipline: {
    id: string
    name: string
    materials: { count: number }[]
    feedbacks: { count: number }[]
  }
  year?: number
}

export default function DisciplineCard({ discipline, year }: DisciplineCardProps) {
  const materialsCount = discipline.materials?.[0]?.count ?? 0
  const feedbacksCount = discipline.feedbacks?.[0]?.count ?? 0

  const params = useParams()
  const cursoId = params?.cursoId as string

  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleCopyLink(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/cursos/${cursoId}/${discipline.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setMenuOpen(false)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Link href={`/cursos/${cursoId}/${discipline.id}`} className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col gap-3 h-full border-2 border-transparent hover:border-primary/40">
      <div className="flex items-start justify-between">
        {year ? (
          <span className="text-xs font-semibold text-primary bg-red-50 px-2 py-1 rounded-full">
            {year}º Ano
          </span>
        ) : (
          <span />
        )}
        <div ref={menuRef} className="relative">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(o => !o) }}
            className="text-gray-400 hover:text-primary transition-colors duration-200 p-0.5 rounded"
            aria-label="Opções"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[140px]">
              <button
                onClick={handleCopyLink}
                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? 'Copiado!' : 'Copiar link'}
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 leading-snug">{discipline.name}</h3>

      <div className="mt-auto flex items-center gap-4 text-xs text-primary pt-3 border-t border-gray-50">
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          {materialsCount}
        </span>
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {feedbacksCount}
        </span>
      </div>
    </Link>
  )
}
