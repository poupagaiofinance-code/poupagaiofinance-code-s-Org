import { PageContainer } from '../components/layout/PageContainer';
import { Brand } from '../components/ui/Brand';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CheckCircle2, ShieldCheck, Terminal, Smartphone } from 'lucide-react';

export function FoundationPage() {
  const foundationChecks = [
    {
      title: 'Ambiente React & Vite',
      description: 'Pipeline de build e execução operando sem falhas de runtime.',
      icon: Terminal,
    },
    {
      title: 'TypeScript & Configuração',
      description: 'Tipagem estrita ativa e verificação estática aprovada.',
      icon: CheckCircle2,
    },
    {
      title: 'Tema Oficial & Tokens',
      description: 'Paleta verde financeira institucional e variáveis estruturadas.',
      icon: ShieldCheck,
    },
    {
      title: 'Design Responsivo & Mobile-First',
      description: 'Layout testado e adaptado para resoluções de 320px a 1440px+.',
      icon: Smartphone,
    },
  ];

  return (
    <PageContainer>
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-8 sm:pb-12 border-b border-[var(--border-color)]">
        <Brand />
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" aria-hidden="true" />
          <span>ETAPA 1 — FUNDAÇÃO</span>
        </div>
      </header>

      {/* Main Presentation Area */}
      <main className="flex-1 flex flex-col justify-center py-10 sm:py-16">
        <div className="max-w-2xl">
          <div className="mb-4">
            <StatusBadge label="Projeto iniciado com sucesso" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
            POUPAGAIO FINANCE
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] font-normal leading-relaxed mb-4">
            Seu dinheiro mais organizado, simples e fácil de entender.
          </p>

          <p className="text-sm font-medium text-[var(--brand-primary)] mb-10">
            Fundação do sistema pronta.
          </p>

          {/* Foundation Health Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-5 sm:p-6 mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Status da Infraestrutura Inicial
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foundationChecks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="mt-0.5 text-[var(--brand-primary)] shrink-0">
                      <IconComponent className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-primary)]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-[var(--text-muted)] leading-relaxed">
            Aplicação saudável e validada. Aguardando autorização para a Etapa 2.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-8 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>&copy; {new Date().getFullYear()} Poupagaio Finance</span>
        <span>Etapa 1 — Fundação Concluída</span>
      </footer>
    </PageContainer>
  );
}
