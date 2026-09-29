import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  isPassword?: boolean;
}

export function FormField({
  label,
  id,
  error,
  isPassword = false,
  type = 'text',
  className = '',
  disabled,
  ...props
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-[var(--text-primary)]"
      >
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={inputType}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-surface)] border ${
            error
              ? 'border-red-500 focus-visible:outline-red-500'
              : 'border-[var(--border-color)] focus-visible:outline-[var(--brand-primary)]'
          } text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus-visible:outline-2 focus-visible:outline-offset-1 transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
            isPassword ? 'pr-10' : ''
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] rounded-xs p-1"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {error && (
        <span role="alert" className="text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
