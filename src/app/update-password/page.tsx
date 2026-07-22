'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const icons = {
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
}


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

const supabase = createClient(supabaseUrl, supabasePublishableKey)

export default function AtualizarPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    if (password.length < 8) {
      setErrorMessage('A palavra-passe deve ter pelo menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('As palavras-passe não coincidem.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        console.error('Erro ao atualizar password:', error)
        setErrorMessage('Não foi possível atualizar a palavra-passe. Abra novamente o link enviado por email.')
        return
      }

      setSuccessMessage('Palavra-passe atualizada com sucesso.')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Erro ao atualizar password:', error)
      setErrorMessage('Erro de ligação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-104px)] bg-[#f4f5f7] flex items-center justify-center px-4 py-4 md:py-5">
      <section className="w-full max-w-[405px] rounded-lg bg-white px-9 py-9 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e6ea] text-[#87001f]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a6 6 0 0112 0v2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11l2 2 4-4" />
            </svg>
          </div>

          <h1 className="text-[22px] font-bold leading-tight text-[#071426]">
            Criar Nova Palavra-passe
          </h1>

          <p className="mt-3 max-w-[280px] text-sm leading-5 text-[#7a5f6b]">
            Introduza uma nova palavra-passe para a sua conta.
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#3c2530]"
            >
              Nova palavra-passe
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setErrorMessage('')
                setSuccessMessage('')
              }}
              placeholder="Mínimo 8 caracteres"
              className="h-12 w-full rounded-xl border border-transparent bg-[#f1f1f3] px-4 text-sm text-[#1f2937] outline-none transition placeholder:text-[#b5b1b6] focus:border-[#87001f]/30 focus:ring-4 focus:ring-[#87001f]/10"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#3c2530]"
            >
              Confirmar palavra-passe
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setErrorMessage('')
                setSuccessMessage('')
              }}
              placeholder="Repita a palavra-passe"
              className="h-12 w-full rounded-xl border border-transparent bg-[#f1f1f3] px-4 text-sm text-[#1f2937] outline-none transition placeholder:text-[#b5b1b6] focus:border-[#87001f]/30 focus:ring-4 focus:ring-[#87001f]/10"
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-medium text-[#87001f]">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-xs font-medium text-green-700">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#87001f] text-sm font-bold text-white shadow-[0_8px_16px_rgba(135,0,31,0.25)] transition hover:bg-[#74001b] focus:outline-none focus:ring-2 focus:ring-[#87001f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'A atualizar...' : 'Atualizar Palavra-passe'}
          </button>
        </form>

        <div className="my-8 h-px w-full bg-[#ebe5e8]" />

        <div className="flex justify-center">
          <Link
            href="/login"
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