'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/cursos', label: 'Cursos' },
    { href: '/suporte', label: 'Suporte' },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <nav
        className="max-w-6xl mx-auto px-4 h-14 flex items-center"
        aria-label="Navegação principal"
      >
        {/* Desktop: logo esquerda */}
        <Link
          href="/"
          className="hidden md:block text-[#8B1A1A] font-bold text-xl tracking-tight"
          aria-label="REP - Página inicial"
        >
          REP
        </Link>

        {/* Desktop: links centro */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-sm transition-colors pb-1 border-b-2 ${
                  isActive
                    ? 'text-[#8B1A1A] border-[#8B1A1A]'
                    : 'text-gray-600 border-transparent hover:text-[#8B1A1A]'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Desktop: botões auth direita */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/entrar" className="text-sm text-gray-600 hover:text-[#8B1A1A] transition-colors">
            Entrar
          </Link>
          <Link
            href="/registar"
            className="text-sm text-white bg-[#8B1A1A] px-4 py-2 rounded hover:bg-[#701515] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B1A1A] focus:ring-offset-2"
          >
            Registar
          </Link>
        </div>

        {/* Mobile: espaço vazio esquerda + logo centro + hamburger direita */}
        <div className="flex md:hidden w-full items-center justify-between">
          <div className="w-10" />

          <Link
            href="/"
            className="text-[#8B1A1A] font-bold text-xl tracking-tight"
            aria-label="REP - Página inicial"
          >
            REP
          </Link>

          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#8B1A1A] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-6 pt-2 flex flex-col gap-1 border-t border-gray-100">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#8B1A1A]/8 text-[#8B1A1A]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#8B1A1A]'
                }`}
              >
                {label}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A]" aria-hidden="true" />
                )}
              </Link>
            )
          })}

          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/entrar"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-center py-2.5 px-4 rounded-xl text-gray-700 border border-gray-200 hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors font-medium"
            >
              Entrar
            </Link>
            <Link
              href="/registar"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-center py-2.5 px-4 rounded-xl text-white bg-[#8B1A1A] hover:bg-[#701515] transition-colors font-medium"
            >
              Registar
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
