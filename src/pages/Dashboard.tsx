// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Dashboard() {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  async function fetchMe() {
    setLoading(true);
    setMsg('Cargando usuario...');
    try {
      // El interceptor añade Authorization y x-csrf; no pasamos headers aquí
      const { data } = await api.get('/auth/me');
      const user = (data && (data.user ?? data)) || null; // tolera ambas respuestas
      setMe(user);
      setMsg('');
    } catch (err: any) {
      setMe(null);
      setMsg(err?.response?.data?.message ?? 'No autenticado');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await api.post('/auth/logout'); // interceptor añade x-csrf
    } catch {
      // ignoramos error de logout
    } finally {
      localStorage.removeItem('mg_access');
      window.location.href = '/';
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '40px auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchMe}>Refrescar</button>
          <button onClick={handleLogout}>Salir</button>
        </div>
      </header>

      {loading && <p>⏳ {msg || 'Cargando...'}</p>}

      {!loading && me && (
        <section style={{ marginTop: 16 }}>
          <h2>Usuario</h2>
          <pre
            style={{
              background: '#f6f6f6',
              padding: 12,
              borderRadius: 8,
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(me, null, 2)}
          </pre>
        </section>
      )}

      {!loading && !me && (
        <section style={{ marginTop: 16 }}>
          <p>❌ {msg || 'No autenticado'}</p>
          <p>
            Vuelve al <a href="/">login</a>.
          </p>
        </section>
      )}
    </div>
  );
}
