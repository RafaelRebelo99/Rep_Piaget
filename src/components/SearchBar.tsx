'use client'
import { useState } from 'react'

interface Props {
    placeholder?: string
    onSearch: (query: string) => void
}

export default function SearchBar({ placeholder, onSearch }: Props) {
    const [query, setQuery] = useState("")

 return (
   <div className="flex items-center bg-white rounded-full shadow-sm px-4 py-2 w-full max-w-2xl">
  <span className="text-gray-400 mr-3">🔍</span>
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder={placeholder ?? "Que área do conhecimento procuras hoje?"}
    className="flex-1 outline-none text-gray-600 bg-transparent"
  />
  <button
    onClick={() => onSearch(query)}
    className="bg-[#8B1A1A] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#701515] transition-colors"
  >
    Pesquisar
  </button>
</div>

    )
}
