import { useState } from 'react';
import { api } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('demo@mg.mx');
  const [password, setPassword] = useState('P4ssw0rd!');
  const [msg, setMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Iniciando...');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('mg_access', data.access); // guarda access
      setMsg('✅ Listo, redirigiendo...');
      window.location.href = '/dashboard';
    } catch (err: any) {
      setMsg(`❌ ${err?.response?.data?.message ?? 'Error'}`);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Enlace Ganadero — Login</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
        <button>Entrar</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
