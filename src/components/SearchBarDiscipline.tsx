'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'

interface Props {
  placeholder?: string
  onSearch?: (query: string) => void
}

export default function SearchBar({ placeholder, onSearch }: Props) {
  const [query, setQuery] = useState("")

  return (
    <div className="flex items-center bg-gray-100 rounded-xl pl-4 pr-5 py-3 w-full border border-gray-200 focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-sm transition-all">
  <Search className="text-primary-dark w-4 h-4 mr-3" strokeWidth={2.5} />
      
      <input
        type="text"
        value={query}
        onChange={(e) => { 
          const val = e.target.value;
          setQuery(val); 
          onSearch?.(val); // Pesquisa em tempo real
        }}
        placeholder={placeholder ?? "Pesquisar nos materiais..."}
        className="flex-1 outline-none text-sm text-gray-600 bg-transparent placeholder:text-gray-400"
      />
    </div>
  )
}