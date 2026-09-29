import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Valida estritamente se a string é uma URL HTTP ou HTTPS válida.
 */
function isValidHttpUrl(str: string): boolean {
  if (!str) return false;
  try {
    const parsed = new URL(str);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Verificação explícita da configuração do Supabase.
 * Sem decodificação de JWT, sem extração de ref, sem suposições de URL e sem URLs fictícias.
 */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  isValidHttpUrl(supabaseUrl) &&
  !supabaseUrl.includes('seu-projeto') &&
  !supabaseAnonKey.includes('sua-chave')
);

/**
 * Mensagem clara de diagnóstico quando a configuração está ausente ou inválida.
 */
export const supabaseConfigError: string | null = !supabaseUrl
  ? 'Configuração do Supabase ausente: VITE_SUPABASE_URL não foi informada nas variáveis de ambiente.'
  : !isValidHttpUrl(supabaseUrl)
  ? `Configuração do Supabase inválida: VITE_SUPABASE_URL ("${supabaseUrl}") não é uma URL HTTP ou HTTPS válida. Ela deve conter uma URL semelhante a: https://PROJECT_REF.supabase.co`
  : !supabaseAnonKey
  ? 'Configuração do Supabase ausente: VITE_SUPABASE_ANON_KEY não foi informada nas variáveis de ambiente.'
  : null;

/**
 * Cliente Supabase oficial com inicialização estrita e fail-fast seguro.
 * Quando não configurado, lança um erro descritivo em vez de quebrar a aplicação com URL inválida.
 */
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : new Proxy({} as SupabaseClient, {
      get(_target, prop) {
        throw new Error(
          supabaseConfigError || 'Configuração do Supabase ausente ou inválida.'
        );
      },
    });
