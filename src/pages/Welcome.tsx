import { Link } from 'react-router-dom';
import { BrandMark } from '../components/IdentityExperience';
import { recordIdentityEvent } from '../lib/identity';

export default function Welcome() {
  recordIdentityEvent('first_access_success');

  return (
    <main className="welcome-page">
      <header className="app-topbar">
        <BrandMark />
        <Link className="secondary-link" to="/dashboard">
          Saltar al dashboard
        </Link>
      </header>
      <section className="welcome-hero" aria-labelledby="welcome-title">
        <p className="identity-eyebrow">Primer acceso</p>
        <h1 id="welcome-title">Bienvenido a tu centro de operacion ganadera</h1>
        <p>
          Completa tu perfil inicial para que el marketplace muestre acciones mas claras desde el
          primer valor: explorar oportunidades reales de compra y venta.
        </p>
        <div className="form-actions">
          <Link className="primary-link" to="/onboarding">
            Completar perfil inicial
          </Link>
          <Link className="secondary-link" to="/auctions">
            Explorar subastas
          </Link>
        </div>
      </section>
    </main>
  );
}
