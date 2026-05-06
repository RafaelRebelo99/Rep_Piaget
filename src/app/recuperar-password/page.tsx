'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

const icons = {
  recover: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10a9 9 0 0115.6-6.1L21 6"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 3v3h-3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 7v5l3 2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 14a9 9 0 11-17.6-3"
      />
    </svg>
  ),
  email: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  send: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10l18-7-7 18-2.5-7.5L3 10z"
      />
    </svg>
  ),
  back: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  ),
}

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalEmail = email.trim().toLowerCase()

    if (!normalEmail.endsWith('@ipiaget.pt')) {
      setSuccessMessage('')
      setEmailError('Por favor, introduza o seu email institucional.')
      return
    }

    setEmailError('')
    setSuccessMessage('Se o email existir, receberá instruções de recuperação.')

    console.log({
      email: normalEmail,
    })
  }

  return (
    <main className="min-h-[calc(100vh-116px)] flex items-start justify-center bg-[#f4f5f7] px-4 pt-10 md:pt-12">
      <section className="w-full max-w-[420px] rounded-2xl bg-white px-8 py-10 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e6ea] text-[#87001f]">
            {icons.recover}
          </div>

          <h1 className="text-[22px] font-bold leading-tight text-[#071426]">
            Recuperar Palavra-passe
          </h1>

          <p className="mt-3 max-w-[280px] text-sm leading-5 text-[#7a5f6b]">
            Introduza o seu email institucional para receber instruções de recuperação.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#3c2530]"
            >
              Email institucional
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9f9399]">
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
                  setSuccessMessage('')
                }}
                placeholder="exemplo@ipiaget.pt"
                className="h-12 w-full rounded-xl border border-transparent bg-[#f1f1f3] pl-11 pr-4 text-sm text-[#1f2937] outline-none transition placeholder:text-[#b5b1b6] focus:border-[#87001f]/30 focus:ring-4 focus:ring-[#87001f]/10"
              />
            </div>

            {emailError && (
              <p className="mt-2 text-xs font-medium text-[#87001f]">
                {emailError}
              </p>
            )}

            {successMessage && (
              <p className="mt-2 text-xs font-medium text-green-700">
                {successMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#87001f] text-sm font-bold text-white shadow-[0_8px_16px_rgba(135,0,31,0.25)] transition hover:bg-[#74001b] focus:outline-none focus:ring-2 focus:ring-[#87001f] focus:ring-offset-2"
          >
            Enviar Instruções
            {icons.send}
          </button>
        </form>

        <div className="my-8 h-px w-full bg-[#ebe5e8]" />

        <div className="flex justify-center">
          <Link
            href="/entrar"
            className="flex items-center gap-1 text-sm font-semibold text-[#87001f] hover:underline"
          >
            {icons.back}
            Voltar para o Login
          </Link>
        </div>
      </section>
    </main>
  )
}
