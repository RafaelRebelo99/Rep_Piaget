'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'

interface Props {
    placeholder?: string
    onSearch: (query: string) => void
}

export default function SearchBar({ placeholder, onSearch }: Props) {
    const [query, setQuery] = useState("")

 return (
   <div className="flex items-center bg-white rounded-full shadow-sm hover:shadow-md px-4 py-2 w-full max-w-2xl">
  <Search className="h-4 w-4 text-gray-400 mr-3 shrink-0" />
  <input
    type="text"
    value={query}
    onChange={(e) => { setQuery(e.target.value); onSearch(e.target.value) }}
    placeholder={placeholder ?? "Explorar Cursos..."}
    className="flex-1 outline-none text-gray-600 bg-transparent"
  />
  <button
    onClick={() => onSearch(query)}
    className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-colors"
  >
    Pesquisar
  </button>
</div>

    )
}



