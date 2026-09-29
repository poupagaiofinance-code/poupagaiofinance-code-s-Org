import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Poupagaio Finance - Erro não tratado capturado pelo ErrorBoundary:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          aria-live="assertive"
          className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8faf8]"
        >
          <div className="w-full max-w-md bg-white border border-[#dbe4de] rounded-lg p-6 sm:p-8 text-center shadow-xs">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#111d16] tracking-tight mb-2">
              Não foi possível carregar o Poupagaio Finance.
            </h1>
            <p className="text-sm text-[#4b5d52] mb-6 leading-relaxed">
              Ocorreu uma falha inesperada na interface. Por favor, tente recarregar a página para continuar.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md font-medium text-sm text-white bg-[#15803d] hover:bg-[#166534] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d] cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
