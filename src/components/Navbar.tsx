'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  {
    href: '/',
    label: 'Cursos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    href: '/suporte',
    label: 'Suporte',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const authLinks = [
  {
    href: '/entrar',
    label: 'Entrar',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    ),
  },
  {
    href: '/registar',
    label: 'Registar',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <nav
        className="max-w-6xl mx-auto px-4 h-14 flex items-center"
        aria-label="Navegação principal"
      >
        {/* Desktop: logo esquerda */}
        <Link
          href="/"
          className="hidden md:block text-primary font-bold text-xl tracking-tight"
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
                    ? 'text-primary border-[#8B1A1A]'
                    : 'text-gray-600 border-transparent hover:text-primary'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Desktop: botões auth direita */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/entrar" className="text-sm text-gray-600 hover:text-primary transition-colors">
            Entrar
          </Link>
          <Link
            href="/registar"
            className="text-sm text-white bg-primary px-4 py-2 rounded hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Registar
          </Link>
        </div>

        {/* Mobile: logo centrado + hamburger direita */}
        <div className="flex md:hidden w-full items-center justify-between">
          <div className="w-10" />

          <Link
            href="/"
            className="text-primary font-bold text-xl tracking-tight"
            aria-label="REP - Página inicial"
          >
            REP
          </Link>

          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>


      {/* Mobile menu — slide abaixo da navbar */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Links de navegação */}
        <div className="flex flex-col gap-1 px-4 py-4">
          {[...navLinks, ...authLinks].map(({ href, label, icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {icon}
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}
