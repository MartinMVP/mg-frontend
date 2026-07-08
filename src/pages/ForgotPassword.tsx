import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FormField, IdentityShell, StatusNotice } from '../components/IdentityExperience';
import { recordIdentityEvent } from '../lib/identity';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);
    if (!isEmail(email.trim())) {
      setError('Escribe un correo valido para recuperar acceso.');
      return;
    }
    setError('');
    setSubmitted(true);
    recordIdentityEvent('password_recovery_started');
    recordIdentityEvent('password_recovery_blocked', { reason: 'backend_endpoint_unavailable' });
  }

  return (
    <IdentityShell
      eyebrow="Recuperacion de acceso"
      title="Recupera tu cuenta"
      subtitle="Ingresa tu correo para recibir instrucciones de recuperacion cuando el contrato backend este disponible."
    >
      {submitted && (
        <StatusNotice tone="warning" title="Recuperacion pendiente de backend">
          <p>
            El frontend ya contiene la experiencia de recuperacion. El backend actual no expone un
            endpoint publico para enviar enlaces de restablecimiento, por lo que no se envio correo.
          </p>
        </StatusNotice>
      )}

      <form className="identity-form" onSubmit={handleSubmit} noValidate>
        <FormField id="recovery-email" label="Correo electronico" error={error}>
          <input
            autoComplete="email"
            id="recovery-email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nombre@empresa.com"
            type="email"
            value={email}
          />
        </FormField>
        <div className="form-actions">
          <button type="submit">Solicitar recuperacion</button>
          <Link className="secondary-link" to="/">
            Volver al inicio
          </Link>
        </div>
      </form>
    </IdentityShell>
  );
}
