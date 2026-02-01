/**
 * Valida se um email é válido
 * @param email - Email a ser validado
 * @returns boolean - true se válido, false se inválido
 */
export function validateEmail(email: string): boolean {
  if (!email) return false

  // Regex simples para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email)
}

/**
 * Retorna mensagem de erro de email
 * @param email - Email a ser validado
 * @returns string - Mensagem de erro ou string vazia se válido
 */
export function getEmailErrorMessage(email: string): string {
  if (!email) {
    return 'Email é obrigatório'
  }

  if (!validateEmail(email)) {
    return 'Email inválido'
  }

  return ''
}