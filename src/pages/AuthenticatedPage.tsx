import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PageContainer } from '../components/layout/PageContainer';
import { Brand } from '../components/ui/Brand';
import { LogOut, UserCheck, ShieldCheck, Mail } from 'lucide-react';

export function AuthenticatedPage() {
  const { user, profile, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = profile?.full_name?.trim() ||
    (user?.user_metadata?.full_name as string)?.trim() ||
    user?.email?.split('@')[0] ||
    'Usuário';

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
  };

  return (
    <PageContainer>
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-8 sm:pb-12 border-b border-[var(--border-color)]">
        <Brand />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" aria-hidden="true" />
            <span>ETAPA 2 — AUTENTICAÇÃO</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-red-600 transition-colors cursor-pointer px-2.5 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border-color)] hover:border-red-200 bg-[var(--bg-surface)] focus-visible:outline-2 focus-visible:outline-red-500"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{loggingOut ? 'Saindo...' : 'Sair'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center py-10 sm:py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--brand-subtle)] border border-[var(--brand-border)] text-xs font-medium text-[var(--brand-primary)] mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" aria-hidden="true" />
            <span>Sessão ativa e autenticada</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
            POUPAGAIO FINANCE
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-[var(--text-primary)] mb-2">
            Olá, <span className="text-[var(--brand-primary)]">{displayName}</span>
          </p>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-8">
            Sua conta está conectada com sucesso.
          </p>

          {/* Card com Detalhes da Conta Autenticada */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-5 sm:p-6 mb-8 shadow-xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Status da Conexão e Perfil
            </h2>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-sm">
                <div className="text-[var(--brand-primary)] shrink-0">
                  <UserCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">Nome registrado</span>
                  <span className="font-medium text-[var(--text-primary)]">{displayName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="text-[var(--brand-primary)] shrink-0">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">E-mail autenticado</span>
                  <span className="font-medium text-[var(--text-primary)]">{user?.email ?? 'Não informado'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="text-[var(--brand-primary)] shrink-0">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">Segurança e RLS</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    Políticas ativas · Perfil isolado por auth.uid()
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={loggingOut}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-[var(--radius-sm)] bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] cursor-pointer"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>{loggingOut ? 'Saindo...' : 'Sair da conta'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-8 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>&copy; {new Date().getFullYear()} Poupagaio Finance</span>
        <span>ETAPA 2 — AUTENTICAÇÃO</span>
      </footer>
    </PageContainer>
  );
}
