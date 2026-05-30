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

type ValidatePasswordParams = {
  password: string
  email: string
}

type ValidatePasswordConfirmationParams = {
  password: string
  confirmPassword: string
}

export function validatePassword({ password, email }: ValidatePasswordParams) {
  const normalPassword = password.trim()
  const normalEmail = email.trim().toLowerCase()
  const passwordLower = normalPassword.toLowerCase()
  const emailUsername = normalEmail.split('@')[0]
  const emailUsernameIsNumeric = /^\d+$/.test(emailUsername)

  if (!normalPassword) {
    return 'Por favor, introduza uma palavra-passe.'
  }

  if (normalPassword.length < 8) {
    return 'A palavra-passe deve ter no mínimo 8 caracteres.'
  }

  if (weakPasswords.includes(passwordLower)) {
    return 'A palavra-passe é muito fraca.'
  }

  if (emailUsernameIsNumeric && passwordLower.includes(emailUsername)) {
    return 'A palavra-passe não deve conter o número do email.'
  }

  if (normalEmail && passwordLower.includes(normalEmail)) {
    return 'A palavra-passe não deve conter o email.'
  }

  return ''
}

export function validatePasswordConfirmation({
  password,
  confirmPassword,
}: ValidatePasswordConfirmationParams) {
  if (!confirmPassword.trim()) {
    return 'Por favor, confirme a palavra-passe.'
  }

  if (password.trim() !== confirmPassword.trim()) {
    return 'As palavras-passe não coincidem.'
  }

  return ''
}
