'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

const icons = {
  graduation: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.42A12 12 0 0119 17.5c-2.1.32-4.07 1.14-5.82 2.36a2 2 0 01-2.36 0A12 12 0 005 17.5a12 12 0 01.84-6.92L12 14z" />
    </svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  lock: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0v4" />
    </svg>
  ),
}

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalEmail = email.trim().toLowerCase()

    if (!normalEmail.endsWith('@ipiaget.pt')) {
      setEmailError('Por favor, introduza o seu email institucional.')
      return
    }

    setEmailError('')

    console.log({
      email: normalEmail,
      password,
      rememberMe,
    })
  }

  return (
    <main className="min-h-[calc(100vh-116px)] flex items-start justify-center bg-[#f4f5f7] px-4 pt-8 md:pt-10">
      <section className="w-full max-w-[405px] rounded-lg bg-white px-9 py-9 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e6ea] text-[#87001f]">
            {icons.graduation}
          </div>

          <h1 className="text-[26px] font-bold leading-tight text-[#071426]">
            Bem-vindo ao REP
          </h1>

          <p className="mt-2 text-sm text-[#8b7480]">
            Aceda ao repositório académico oficial.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-9 space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#3c2530]">
              Email
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa5aa]">
                {icons.email}
              </span>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setEmailError('')
                }}
                placeholder="exemplo@ipiaget.pt"
                className="h-11 w-full rounded-md border border-transparent bg-[#f1f1f3] pl-11 pr-4 text-sm text-[#1f2937] outline-none transition placeholder:text-[#b5b1b6] focus:border-[#87001f]/30 focus:ring-4 focus:ring-[#87001f]/10"
              />
            </div>

            {emailError && (
              <p className="mt-2 text-xs font-medium text-[#87001f]">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-[#3c2530]">
              Palavra-passe
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa5aa]">
                {icons.lock}
              </span>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-md border border-transparent bg-[#f1f1f3] pl-11 pr-4 text-sm text-[#1f2937] outline-none transition placeholder:text-[#b5b1b6] focus:border-[#87001f]/30 focus:ring-4 focus:ring-[#87001f]/10"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#6f5b64]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-[#dec7cf] text-[#87001f] focus:ring-[#87001f]"
              />
              Lembrar-me
            </label>

            <Link href="/recuperar-password" className="font-semibold text-[#87001f] hover:underline">
              Esqueceu a palavra-passe?
            </Link>
          </div>

          <button
            type="submit"
            className="h-12 w-full rounded-md bg-[#87001f] text-sm font-bold text-white shadow-[0_8px_16px_rgba(135,0,31,0.25)] transition hover:bg-[#74001b] focus:outline-none focus:ring-2 focus:ring-[#87001f] focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>

        <div className="my-9 h-px w-full bg-[#ebe5e8]" />

        <p className="text-center text-xs text-[#6f5b64]">
          Não tem conta?{' '}
          <Link href="/registar" className="font-bold text-[#87001f] hover:underline">
            Registar
          </Link>
        </p>
      </section>
    </main>
  )
}
