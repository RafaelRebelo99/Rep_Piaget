'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
const icons = {
    eye: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    ),

    eyeOff: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.5-7a9.951 9.951 0 011.667-4.826M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.586 7.586l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414z" />
      </svg>
    ),
}

const weakPasswords = [
  '12345678',
  'password',
  'qwerty',
  'qwerty123',
  '123456789',
  '11111111',
  '00000000',
  'abc12345',
]

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalName = name.trim()
    const normalEmail = email.trim().toLowerCase()
    const normalPassword = password.trim()
    const passwordLower = normalPassword.toLowerCase()
    const emailUsername = normalEmail.split('@')[0]

    let hasError = false

    if (!normalName) {
      setNameError('Por favor, introduza o seu nome completo.')
      hasError = true
    } else {
      setNameError('')
    }

    if (!normalEmail.endsWith('@ipiaget.pt')) {
      setEmailError('Por favor, introduza o seu email institucional.')
      hasError = true
    } else {
      setEmailError('')
    }

    if (!normalPassword) {
      setPasswordError('Por favor, introduza uma palavra-passe.')
      hasError = true
    } else if (normalPassword.length < 8) {
      setPasswordError('A palavra-passe deve ter pelo menos 8 caracteres.')
      hasError = true
    } else if (weakPasswords.includes(passwordLower)) {
      setPasswordError('A palavra-passe é muito fraca.')
      hasError = true
    } else if (emailUsername && passwordLower.includes(emailUsername)) {
      setPasswordError('A palavra-passe não deve conter o nome do email.')
      hasError = true
    } else if (normalEmail && passwordLower.includes(normalEmail)) {
      setPasswordError('A palavra-passe não deve conter o email.')
      hasError = true
    } else {
      setPasswordError('')
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Por favor, confirme a palavra-passe.')
      hasError = true
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('As palavras-passe não coincidem.')
      hasError = true
    } else {
      setConfirmPasswordError('')
    }

    if (hasError) return

    console.log({
      name: normalName,
      email: normalEmail,
      password,
    })
  }

  return (
    <main className="min-h-[calc(100vh-116px)] flex items-start justify-center bg-[#f4f5f7] px-4 pt-10 md:pt-12">
      <section className="w-full max-w-[405px] rounded-lg bg-white px-9 py-10 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <h1 className="text-center text-[26px] font-bold leading-tight text-[#071426]">
          Criar Conta
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b3d4a]"
            >
              Nome completo
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setNameError('')
              }}
              placeholder="Ex: Maria Silva"
              className="h-11 w-full rounded-md border border-transparent bg-[#f1f1f3] px-4 text-sm text-[#1f2937] outline-none transition placeholder:text-[#b5b1b6] focus:border-[#87001f]/30 focus:ring-4 focus:ring-[#87001f]/10"
            />

            {nameError && (
              <p className="mt-2 text-xs font-medium text-[#87001f]">
                {nameError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b3d4a]"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setEmailError('')
              }}
              placeholder="nome@ipiaget.pt"
              className="h-11 w-full rounded-md border border-transparent bg-[#f1f1f3] px-4 text-sm text-[#1f2937] outline-none transition placeholder:text-[#b5b1b6] focus:border-[#87001f]/30 focus:ring-4 focus:ring-[#87001f]/10"
            />

            {emailError && (
              <p className="mt-2 text-xs font-medium text-[#87001f]">
                {emailError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
  <div>
    <label
      htmlFor="password"
      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b3d4a]"
    >
      Palavra-passe
    </label>

    <div className="relative w-full">
      <input
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(event) => {
          setPassword(event.target.value)
          setPasswordError('')
        }}
        placeholder="••••••••"
        className="h-11 w-full rounded-md border border-transparent bg-[#f1f1f3] px-4 pr-10 text-sm text-[#1f2937] outline-none transition placeholder:text-[#b5b1b6] focus:border-[#87001f]/30 focus:ring-4 focus:ring-[#87001f]/10"
      />

      <button
        type="button"
        onPointerDown={(event) => {
          event.preventDefault()
          setShowPassword(true)
        }}
        onPointerUp={() => setShowPassword(false)}
        onPointerLeave={() => setShowPassword(false)}
        onPointerCancel={() => setShowPassword(false)}
        onBlur={() => setShowPassword(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87001f]"
        aria-label="Manter premido para mostrar a palavra-passe"
      >
        {showPassword ? icons.eyeOff : icons.eye}
      </button>
    </div>
  </div>

  <div>
    <label
      htmlFor="confirmPassword"
      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b3d4a]"
    >
      Confirmar
    </label>

    <div className="relative w-full">
      <input
        id="confirmPassword"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(event) => {
          setConfirmPassword(event.target.value)
          setConfirmPasswordError('')
        }}
        placeholder="••••••••"
        className="h-11 w-full rounded-md border border-transparent bg-[#f1f1f3] px-4 pr-10 text-sm text-[#1f2937] outline-none transition placeholder:text-[#b5b1b6] focus:border-[#87001f]/30 focus:ring-4 focus:ring-[#87001f]/10"
      />

      <button
        type="button"
        onPointerDown={(event) => {
          event.preventDefault()
          setShowConfirmPassword(true)
        }}
        onPointerUp={() => setShowConfirmPassword(false)}
        onPointerLeave={() => setShowConfirmPassword(false)}
        onPointerCancel={() => setShowConfirmPassword(false)}
        onBlur={() => setShowConfirmPassword(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87001f]"
        aria-label="Manter premido para mostrar a confirmação da palavra-passe"
      >
        {showConfirmPassword ? icons.eyeOff : icons.eye}
      </button>
    </div>
  </div>
</div>
          {(passwordError || confirmPasswordError) && (
            <div className="space-y-1">
              {passwordError && (
                <p className="text-xs font-medium text-[#87001f]">
                  {passwordError}
                </p>
              )}

              {confirmPasswordError && (
                <p className="text-xs font-medium text-[#87001f]">
                  {confirmPasswordError}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="h-12 w-full rounded-md bg-[#87001f] text-sm font-bold text-white shadow-[0_8px_16px_rgba(135,0,31,0.25)] transition hover:bg-[#74001b] focus:outline-none focus:ring-2 focus:ring-[#87001f] focus:ring-offset-2"
          >
            Registar
          </button>
        </form>

        <div className="my-9 h-px w-full bg-[#ebe5e8]" />

        <p className="text-center text-xs text-[#6f5b64]">
          Já tem uma conta?{' '}
          <Link href="/entrar" className="font-bold text-[#87001f] hover:underline">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  )
}
