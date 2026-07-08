import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FormField, IdentityShell, StatusNotice } from '../components/IdentityExperience';

export default function ResetPassword() {
  const params = useParams();
  const [token, setToken] = useState(params.token ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);

    if (!token.trim()) {
      setError('El enlace o token de recuperacion expiro o no esta presente.');
      return;
    }
    if (password.length < 8 || password !== confirmPassword) {
      setError('Usa una contrasena de al menos 8 caracteres y confirma que coincida.');
      return;
    }

    setError('');
    setSubmitted(true);
  }

  return (
    <IdentityShell
      eyebrow="Nueva contrasena"
      title="Define una contrasena nueva"
      subtitle="Esta pantalla queda lista para conectarse al endpoint de restablecimiento cuando exista."
    >
      {submitted && (
        <StatusNotice tone="warning" title="Cambio pendiente de backend">
          <p>
            No se actualizo la contrasena porque el backend actual no expone el contrato publico de
            restablecimiento.
          </p>
        </StatusNotice>
      )}
      {error && (
        <StatusNotice tone="error" title="Revisa los datos">
          <p>{error}</p>
        </StatusNotice>
      )}

      <form className="identity-form" onSubmit={handleSubmit} noValidate>
        <FormField id="reset-token" label="Token de recuperacion">
          <input
            id="reset-token"
            onChange={(event) => setToken(event.target.value)}
            placeholder="Pega el token recibido"
            value={token}
          />
        </FormField>
        <FormField id="reset-password" label="Nueva contrasena">
          <input
            autoComplete="new-password"
            id="reset-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </FormField>
        <FormField id="reset-confirm-password" label="Confirmar contrasena">
          <input
            autoComplete="new-password"
            id="reset-confirm-password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            value={confirmPassword}
          />
        </FormField>
        <div className="form-actions">
          <button type="submit">Actualizar contrasena</button>
          <Link className="secondary-link" to="/">
            Volver al inicio
          </Link>
        </div>
      </form>
    </IdentityShell>
  );
}
