/**
 * Valida se um CPF é válido usando o algoritmo oficial
 * @param cpf - CPF a ser validado (com ou sem máscara)
 * @returns boolean - true se válido, false se inválido
 */
export function validateCPF(cpf: string): boolean {
  if (!cpf) return false

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '')

  // CPF deve ter 11 dígitos
  if (cleanCPF.length !== 11) return false

  // Valida se todos os dígitos são iguais (CPFs inválidos)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  // Calcula primeiro dígito verificador
  let sum = 0
  let remainder = 0

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (11 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  if (remainder !== parseInt(cleanCPF.substring(9, 10), 10)) {
    return false
  }

  // Calcula segundo dígito verificador
  sum = 0

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (12 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  if (remainder !== parseInt(cleanCPF.substring(10, 11), 10)) {
    return false
  }

  return true
}

/**
 * Formata CPF com máscara (XXX.XXX.XXX-XX)
 * @param cpf - CPF a ser formatado
 * @returns string - CPF formatado
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '')

  return cleanCPF
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/**
 * Retorna mensagem de erro de CPF
 * @param cpf - CPF a ser validado
 * @returns string - Mensagem de erro ou string vazia se válido
 */
export function getCPFErrorMessage(cpf: string): string {
  if (!cpf) {
    return 'CPF é obrigatório'
  }

  const cleanCPF = cpf.replace(/\D/g, '')

  if (cleanCPF.length < 11) {
    return 'CPF deve ter 11 dígitos'
  }

  if (!validateCPF(cpf)) {
    return 'CPF inválido'
  }

  return ''
}