import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/auth/AuthPage';
import { AuthenticatedPage } from './pages/AuthenticatedPage';

function AppContent() {
  const { session, loading, isRecoveryMode } = useAuth();

  // Estado de inicialização limpo para evitar flashes de conteúdo durante restauração da sessão
  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[var(--bg-page)] text-[var(--text-secondary)] p-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"
          />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Carregando Poupagaio Finance...
          </span>
        </div>
      </div>
    );
  }

  // Fluxo de recuperação de senha acionado por link externo
  if (isRecoveryMode) {
    return <AuthPage initialMode="reset_password" />;
  }

  // Área protegida provisória da Etapa 2
  if (session) {
    return <AuthenticatedPage />;
  }

  // Telas de autenticação (Login / Cadastro / Recuperação)
  return <AuthPage />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
