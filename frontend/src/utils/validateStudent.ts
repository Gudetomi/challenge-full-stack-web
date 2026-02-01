/**
 * Funções de validação para cadastro de alunos
 * Centraliza toda a lógica de validação em um único lugar
 */

import { getCPFErrorMessage } from './validateCpf'
import { getEmailErrorMessage } from './validateEmail'

/**
 * Valida nome do aluno
 * @param name - Nome a ser validado
 * @returns string - Mensagem de erro ou string vazia se válido
 */
export function getNameErrorMessage(name: string): string {
  if (!name) {
    return 'Nome é obrigatório'
  }

  if (name.length < 3) {
    return 'Nome deve ter pelo menos 3 caracteres'
  }

  return ''
}

/**
 * Valida RA (Registro Acadêmico)
 * @param ra - RA a ser validado
 * @returns string - Mensagem de erro ou string vazia se válido
 */
export function getRAErrorMessage(ra: string): string {
  if (!ra) {
    return 'RA é obrigatório'
  }

  if (ra.length < 3) {
    return 'RA deve ter pelo menos 3 caracteres'
  }

  return ''
}

/**
 * Valida todos os campos de um aluno
 * @param data - Objeto com dados do aluno
 * @returns objeto com mensagens de erro por campo
 */
export function validateStudentForm(data: {
  name: string
  email: string
  ra: string
  cpf: string
}) {
  return {
    name: getNameErrorMessage(data.name),
    email: getEmailErrorMessage(data.email),
    ra: getRAErrorMessage(data.ra),
    cpf: getCPFErrorMessage(data.cpf),
  }
}

/**
 * Verifica se formulário é válido
 * @param errors - Objeto com erros por campo
 * @returns boolean - true se todos os campos são válidos
 */
export function isStudentFormValid(errors: {
  name?: string
  email?: string
  ra?: string
  cpf?: string
}): boolean {
  return (
    !errors.name &&
    !errors.email &&
    !errors.ra &&
    !errors.cpf
  )
}