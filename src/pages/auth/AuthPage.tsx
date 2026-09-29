import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Brand } from '../../components/ui/Brand';
import { FormField } from '../../components/ui/FormField';
import { formatAuthError } from '../../lib/auth-errors';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export type AuthMode = 'login' | 'register' | 'forgot_password' | 'reset_password';

interface AuthPageProps {
  initialMode?: AuthMode;
}

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const {
    isConfigured,
    configError,
    isRecoveryMode,
    setRecoveryMode,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>(isRecoveryMode ? 'reset_password' : initialMode);

  // Formulário - Estados
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status e Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});
  };

  const switchMode = (newMode: AuthMode) => {
    clearMessages();
    setPassword('');
    setConfirmPassword('');
    if (newMode !== 'reset_password') {
      setRecoveryMode(false);
    }
    setMode(newMode);
  };

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // 1. Submit Login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = 'Informe o seu e-mail.';
    } else if (!validateEmail(email)) {
      errors.email = 'Informe um e-mail válido.';
    }

    if (!password) {
      errors.password = 'Informe sua senha.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMessage(formatAuthError(error));
    }
  };

  // 2. Submit Cadastro
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = 'Informe seu nome completo.';
    }

    if (!email.trim()) {
      errors.email = 'Informe seu e-mail.';
    } else if (!validateEmail(email)) {
      errors.email = 'Informe um e-mail válido.';
    }

    if (!password) {
      errors.password = 'Crie uma senha.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter no mínimo 6 caracteres.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirme sua senha.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const { error, needsEmailConfirmation } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      setErrorMessage(formatAuthError(error));
    } else if (needsEmailConfirmation) {
      setSuccessMessage(
        'Conta criada com sucesso! Um e-mail de confirmação foi enviado. Por favor, valide seu e-mail antes de fazer login.'
      );
      setPassword('');
      setConfirmPassword('');
    } else {
      setSuccessMessage('Conta criada com sucesso! Redirecionando...');
    }
  };

  // 3. Submit Esqueci minha senha
  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim() || !validateEmail(email)) {
      setFieldErrors({ email: 'Informe um e-mail válido para recuperação.' });
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      setErrorMessage(formatAuthError(error));
    } else {
      setSuccessMessage(
        'Se existir uma conta com este e-mail, você receberá as instruções para redefinir sua senha.'
      );
    }
  };

  // 4. Submit Redefinir Senha
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    const errors: Record<string, string> = {};
    if (!password) {
      errors.password = 'Informe a nova senha.';
    } else if (password.length < 6) {
      errors.password = 'A nova senha deve ter no mínimo 6 caracteres.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirme a nova senha.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setErrorMessage(formatAuthError(error));
    } else {
      setSuccessMessage('Senha atualizada com sucesso! Você já pode entrar com sua nova senha.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        switchMode('login');
      }, 2500);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-[var(--bg-page)] text-[var(--text-primary)]">
      <div className="w-full max-w-md">
        {/* Cabeçalho de Marca */}
        <header className="flex flex-col items-center text-center mb-8">
          <Brand className="mb-3" />
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" aria-hidden="true" />
            <span>ETAPA 2 — AUTENTICAÇÃO</span>
          </div>
        </header>

        {/* Card Principal */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-6 sm:p-8 shadow-xs">
          {/* Alerta caso variáveis de ambiente não estejam configuradas */}
          {!isConfigured && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-[var(--radius-sm)] bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5"
            >
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold mb-1">Configuração do Supabase ausente ou inválida</p>
                <p className="leading-relaxed text-amber-800">
                  {configError || 'Para autenticar no novo Supabase, defina VITE_SUPABASE_URL (ex: https://PROJECT_REF.supabase.co) e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente.'}
                </p>
              </div>
            </div>
          )}

          {/* Feedback de Erro Geral */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-[var(--radius-sm)] bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Feedback de Sucesso Geral */}
          {successMessage && (
            <div
              role="status"
              className="mb-6 p-3.5 rounded-[var(--radius-sm)] bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">{successMessage}</p>
            </div>
          )}

          {/* MODO 1: LOGIN */}
          {mode === 'login' && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Entrar na conta
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Acesse sua área segura no Poupagaio Finance
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <FormField
                  label="E-mail"
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                  disabled={loading}
                  required
                />

                <FormField
                  label="Senha"
                  id="login-password"
                  isPassword
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                  disabled={loading}
                  required
                />

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot_password')}
                    disabled={loading}
                    className="text-xs text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] rounded-xs"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isConfigured}
                  className="w-full mt-2 py-2.5 px-4 rounded-[var(--radius-sm)] bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  disabled={loading}
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-semibold cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] rounded-xs"
                >
                  Criar conta
                </button>
              </div>
            </div>
          )}

          {/* MODO 2: CRIAR CONTA */}
          {mode === 'register' && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Criar nova conta
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Inicie sua organização financeira
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                <FormField
                  label="Nome completo"
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={fieldErrors.fullName}
                  disabled={loading}
                  required
                />

                <FormField
                  label="E-mail"
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                  disabled={loading}
                  required
                />

                <FormField
                  label="Senha"
                  id="register-password"
                  isPassword
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                  disabled={loading}
                  required
                />

                <FormField
                  label="Confirmar senha"
                  id="register-confirm-password"
                  isPassword
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={fieldErrors.confirmPassword}
                  disabled={loading}
                  required
                />

                <button
                  type="submit"
                  disabled={loading || !isConfigured}
                  className="w-full mt-2 py-2.5 px-4 rounded-[var(--radius-sm)] bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]">
                Já possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  disabled={loading}
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-semibold cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] rounded-xs"
                >
                  Entrar
                </button>
              </div>
            </div>
          )}

          {/* MODO 3: ESQUECI MINHA SENHA */}
          {mode === 'forgot_password' && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Recuperar senha
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Digite seu e-mail cadastrado para receber instruções
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
                <FormField
                  label="E-mail cadastrado"
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                  disabled={loading}
                  required
                />

                <button
                  type="submit"
                  disabled={loading || !isConfigured}
                  className="w-full mt-2 py-2.5 px-4 rounded-[var(--radius-sm)] bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Enviando instruções...' : 'Enviar instruções'}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]">
                Lembrou sua senha?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  disabled={loading}
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-semibold cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] rounded-xs"
                >
                  Voltar para o login
                </button>
              </div>
            </div>
          )}

          {/* MODO 4: REDEFINIR SENHA */}
          {mode === 'reset_password' && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Redefinir sua senha
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Crie uma nova senha segura para sua conta
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                <FormField
                  label="Nova senha"
                  id="reset-password"
                  isPassword
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                  disabled={loading}
                  required
                />

                <FormField
                  label="Confirmar nova senha"
                  id="reset-confirm-password"
                  isPassword
                  autoComplete="new-password"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={fieldErrors.confirmPassword}
                  disabled={loading}
                  required
                />

                <button
                  type="submit"
                  disabled={loading || !isConfigured}
                  className="w-full mt-2 py-2.5 px-4 rounded-[var(--radius-sm)] bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Atualizando senha...' : 'Salvar nova senha'}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)]">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  disabled={loading}
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-semibold cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] rounded-xs"
                >
                  Cancelar e voltar para o login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé simples */}
        <footer className="mt-6 text-center text-xs text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} Poupagaio Finance
        </footer>
      </div>
    </div>
  );
}
