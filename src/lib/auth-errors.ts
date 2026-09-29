/**
 * Mapeamento e tradução de mensagens de erro de autenticação do Supabase para o português.
 */
export function formatAuthError(error: unknown): string {
  if (!error) return 'Ocorreu um erro desconhecido.';

  const message = typeof error === 'object' && error !== null && 'message' in error
    ? String((error as { message: unknown }).message)
    : String(error);

  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials') || lower.includes('invalid_grant')) {
    return 'E-mail ou senha incorretos. Verifique suas credenciais.';
  }
  if (lower.includes('email not confirmed')) {
    return 'E-mail ainda não confirmado. Por favor, verifique seu e-mail para ativar sua conta.';
  }
  if (lower.includes('user already registered') || lower.includes('email address already exists')) {
    return 'Este e-mail já está cadastrado. Faça login ou utilize a recuperação de senha.';
  }
  if (lower.includes('password should be at least') || lower.includes('weak password')) {
    return 'A senha é muito fraca. Ela deve conter no mínimo 6 caracteres.';
  }
  if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('fetch failed')) {
    return 'Problema de conexão com o servidor. Verifique sua internet.';
  }
  if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit')) {
    return 'Muitas solicitações enviadas recentemente. Por favor, aguarde alguns minutos antes de tentar novamente.';
  }
  if (lower.includes('token has expired') || lower.includes('otp_expired')) {
    return 'O link de recuperação expirou. Por favor, solicite um novo link.';
  }
  if (lower.includes('auth session missing') || lower.includes('session expired')) {
    return 'Sua sessão expirou. Faça login novamente.';
  }

  return message;
}
