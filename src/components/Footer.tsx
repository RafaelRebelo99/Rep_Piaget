import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-4">
      <div className="max-w-6xl mx-auto px-6 relative flex items-center justify-center">
        <p className="text-xs text-gray-400 tracking-wide">
          © {new Date().getFullYear()} REP BUILT WITH ❤️
        </p>
        <div className="absolute right-6 flex gap-6">
          <Link
            href="/termos"
            className="text-xs text-gray-400 tracking-widest hover:text-[#8B1A1A] transition-colors uppercase"
          >
            Termos
          </Link>
          <Link
            href="/contactos"
            className="text-xs text-gray-400 tracking-widest hover:text-[#8B1A1A] transition-colors uppercase"
          >
            Contactos
          </Link>
        </div>
      </div>
    </footer>
  )
}
