import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type IdentityShellProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  aside?: ReactNode;
};

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

type NoticeProps = {
  tone?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  children: ReactNode;
};

export function BrandMark() {
  return (
    <Link className="brand-mark" to="/" aria-label="Ir al inicio de Enlace Ganadero">
      <span className="brand-mark__seal" aria-hidden="true">
        EG
      </span>
      <span>
        <strong>Enlace Ganadero</strong>
        <small>Marketplace pecuario</small>
      </span>
    </Link>
  );
}

export function IdentityShell({
  eyebrow = 'Identidad digital',
  title,
  subtitle,
  children,
  aside,
}: IdentityShellProps) {
  return (
    <main className="identity-page">
      <section className="identity-panel" aria-labelledby="identity-title">
        <header className="identity-header">
          <BrandMark />
          <p className="identity-eyebrow">{eyebrow}</p>
          <h1 id="identity-title">{title}</h1>
          <p>{subtitle}</p>
        </header>
        {children}
      </section>
      <aside className="identity-aside" aria-label="Beneficios de Enlace Ganadero">
        {aside ?? (
          <>
            <h2>Opera con confianza desde el primer acceso</h2>
            <p>
              Crea tu cuenta, completa tu perfil inicial y entra al marketplace con una
              experiencia clara para comprar, vender y seguir tus operaciones.
            </p>
            <ul>
              <li>Registro progresivo en tres pasos.</li>
              <li>Recuperacion guiada ante errores comunes.</li>
              <li>Dashboard con siguiente accion visible.</li>
            </ul>
          </>
        )}
      </aside>
    </main>
  );
}

export function FormField({ id, label, error, hint, children }: FieldProps) {
  const describedBy = [
    hint ? `${id}-hint` : '',
    error ? `${id}-error` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div aria-describedby={describedBy || undefined}>{children}</div>
      {hint && (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export function StatusNotice({ tone = 'info', title, children }: NoticeProps) {
  return (
    <div className={`status-notice status-notice--${tone}`} role="status" aria-live="polite">
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}

export function StepIndicator({
  current,
  labels,
}: {
  current: number;
  labels: string[];
}) {
  return (
    <ol className="step-indicator" aria-label="Progreso de registro">
      {labels.map((label, index) => {
        const step = index + 1;
        return (
          <li
            className={step === current ? 'is-current' : step < current ? 'is-done' : ''}
            key={label}
          >
            <span aria-hidden="true">{step}</span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}
