// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import NotificationBell from '../components/NotificationBell';
import { BrandMark, StatusNotice } from '../components/IdentityExperience';
import { getIdentityKpis, getIdentityProfile, isIdentityProfileComplete } from '../lib/identity';

type DashboardUser = {
  email?: string;
  name?: string;
  role?: string;
  createdAt?: string;
};

export default function Dashboard() {
  const [me, setMe] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const profile = getIdentityProfile();
  const kpis = getIdentityKpis();
  const profileComplete = isIdentityProfileComplete(profile);
  const canViewOperations = me?.role === 'admin' || me?.role === 'super';

  async function fetchMe() {
    if (!localStorage.getItem('mg_access')) {
      setLoading(false);
      setMe(null);
      setMsg('No hay sesion activa.');
      return;
    }

    setLoading(true);
    setMsg('Cargando usuario...');
    try {
      const { data } = await api.get('/auth/me');
      const user = (data && (data.user ?? data)) || null;
      setMe(user);
      setMsg('');
    } catch (error) {
      const candidate = error as { response?: { data?: { message?: string; error?: string } } };
      setMe(null);
      setMsg(candidate.response?.data?.message ?? candidate.response?.data?.error ?? 'No autenticado');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Best-effort logout: the local token must be cleared even if the API is unavailable.
    } finally {
      localStorage.removeItem('mg_access');
      window.location.href = '/';
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <main className="dashboard-page">
      <header className="app-topbar">
        <BrandMark />
        <div>
          <nav className="mg-nav">
            <Link to="/auctions">Subastas</Link>
            <Link to="/account/purchases">Compras</Link>
            <Link to="/account/sales">Ventas</Link>
            <Link to="/profile">Perfil</Link>
            {canViewOperations && <Link to="/admin/operations">Operaciones</Link>}
          </nav>
        </div>
        <div className="dashboard-actions">
          <NotificationBell />
          <button className="secondary-button" onClick={fetchMe} type="button">
            Refrescar
          </button>
          <button onClick={handleLogout} type="button">
            Salir
          </button>
        </div>
      </header>

      {loading && <p className="loading-copy">{msg || 'Cargando...'}</p>}

      {!loading && me && (
        <>
          <section className="dashboard-hero" aria-labelledby="dashboard-title">
            <p className="identity-eyebrow">Dashboard</p>
            <h1 id="dashboard-title">
              {me.name ? `Hola, ${me.name}` : 'Bienvenido a Enlace Ganadero'}
            </h1>
            <p>
              Tu siguiente accion de valor es explorar oportunidades vigentes y preparar tu
              operacion comercial.
            </p>
            <div className="form-actions">
              <Link className="primary-link" to="/auctions">
                Explorar marketplace
              </Link>
              {!profileComplete && (
                <Link className="secondary-link" to="/onboarding">
                  Completar perfil
                </Link>
              )}
            </div>
          </section>

          <section className="dashboard-grid" aria-label="Resumen operativo">
            <article className="dashboard-card">
              <h2>Cuenta</h2>
              <p>{me.email ?? 'Correo no disponible'}</p>
              <small>Rol: {me.role ?? 'usuario'}</small>
            </article>
            <article className="dashboard-card">
              <h2>Perfil inicial</h2>
              <p>{profileComplete ? 'Completado' : 'Pendiente'}</p>
              <small>
                {profile?.state
                  ? `${profile.activity} en ${profile.state}`
                  : 'Completa tu perfil para personalizar el inicio.'}
              </small>
            </article>
            <article className="dashboard-card">
              <h2>Identidad</h2>
              <p>{kpis.firstAccessSuccess} accesos iniciales</p>
              <small>{kpis.initialProfileCompleted} perfiles completados en este navegador</small>
            </article>
          </section>
        </>
      )}

      {!loading && !me && (
        <section className="empty-session">
          <StatusNotice tone="warning" title="Sesion requerida">
            <p>{msg || 'No autenticado'}</p>
          </StatusNotice>
          <Link className="primary-link" to="/">
            Ir al login
          </Link>
        </section>
      )}
    </main>
  );
}
