import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { FormField, IdentityShell, StatusNotice } from '../components/IdentityExperience';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg('');
    setEmailError('');
    setPasswordError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Escribe un correo valido.');
      return;
    }
    if (!password) {
      setPasswordError('Escribe tu contrasena.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('mg_access', data.access);
      navigate('/welcome');
    } catch (error) {
      const candidate = error as {
        response?: { status?: number; data?: { message?: string; error?: string } };
        message?: string;
      };
      if (candidate.response?.status === 429) {
        setMsg('Hay demasiados intentos. Espera unos minutos e intenta de nuevo.');
      } else if (candidate.response?.status === 401) {
        setMsg('Correo o contrasena incorrectos.');
      } else if (candidate.message === 'Network Error') {
        setMsg('No pudimos conectar con el servicio. Revisa tu conexion.');
      } else {
        setMsg(candidate.response?.data?.message ?? candidate.response?.data?.error ?? 'No pudimos iniciar sesion.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <IdentityShell
      eyebrow="Acceso seguro"
      title="Entra a Enlace Ganadero"
      subtitle="Accede a tu dashboard, conversaciones y oportunidades del marketplace."
    >
      {msg && (
        <StatusNotice tone="error" title="No pudimos iniciar sesion">
          <p>{msg}</p>
        </StatusNotice>
      )}
      <form className="identity-form" onSubmit={onSubmit} noValidate>
        <FormField id="login-email" label="Correo electronico" error={emailError}>
          <input
            autoComplete="email"
            id="login-email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nombre@empresa.com"
            type="email"
            value={email}
          />
        </FormField>
        <FormField id="login-password" label="Contrasena" error={passwordError}>
          <input
            autoComplete="current-password"
            id="login-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu contrasena"
            type="password"
            value={password}
          />
        </FormField>
        <div className="login-options">
          <Link to="/forgot-password">Olvide mi contrasena</Link>
        </div>
        <button disabled={loading} type="submit">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="identity-footer">
        Nuevo en Enlace Ganadero? <Link to="/register">Crear cuenta</Link>
      </p>
    </IdentityShell>
  );
}
