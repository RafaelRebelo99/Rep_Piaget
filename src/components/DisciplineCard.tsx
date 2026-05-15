interface DisciplineCardProps {
  discipline: {
    id: string
    name: string
    materials: { count: number }[]
    feedbacks: { count: number }[]
  }
}

export default function DisciplineCard({ discipline }: DisciplineCardProps) {
  const materialsCount = discipline.materials?.[0]?.count ?? 0
  const feedbacksCount = discipline.feedbacks?.[0]?.count ?? 0

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span> </span>
        <button className="text-gray-400 hover:text-gray-600" aria-label="Opções p">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      <h3 className="text-sm font-semibold text-gray-800 leading-snug">{discipline.name}</h3>

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
    </div>
  )
}
