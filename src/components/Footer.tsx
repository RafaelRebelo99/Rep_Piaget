import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-4">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:grid sm:grid-cols-3 items-center gap-2">
        <div className="hidden sm:block" />
        <p className="text-xs text-gray-400 tracking-wide text-center flex items-center justify-center gap-1">
          © {new Date().getFullYear()} REP BUILT WITH <Heart className="w-3 h-3 text-primary fill-primary" />
        </p>
        <div className="flex gap-6 sm:justify-end">
          <Link
            href="/termos"
            className="text-xs text-gray-400 tracking-widest hover:text-primary transition-colors uppercase"
          >
            Termos
          </Link>
          <Link
            href="/contactos"
            className="text-xs text-gray-400 tracking-widest hover:text-primary transition-colors uppercase"
          >
            Contactos
          </Link>
        </div>
      </div>
    </footer>
  )
}

