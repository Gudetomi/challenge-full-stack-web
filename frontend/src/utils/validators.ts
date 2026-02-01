export const validateEmail = (email: string): string | boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) || 'E-mail inválido';
};

export const validateCPF = (cpf: string): string | boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return 'CPF deve conter 11 dígitos';
  
  // Aqui você pode adicionar a lógica de cálculo de dígito verificador se desejar
  return true;
};

export const validateRequired = (val: string, fieldName: string): string | boolean => {
  return !!val || `${fieldName} é obrigatório`;
};