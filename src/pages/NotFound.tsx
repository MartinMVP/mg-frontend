import { Link } from 'react-router-dom';
import { BrandMark } from '../components/IdentityExperience';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <BrandMark />
      <section className="not-found-card" aria-labelledby="not-found-title">
        <p className="identity-eyebrow">Pagina no encontrada</p>
        <h1 id="not-found-title">La ruta que buscas no esta disponible</h1>
        <p>
          Puedes volver al dashboard o explorar las oportunidades del marketplace sin perder el
          camino.
        </p>
        <div className="form-actions">
          <Link className="primary-link" to="/dashboard">
            Ir al dashboard
          </Link>
          <Link className="secondary-link" to="/auctions">
            Explorar subastas
          </Link>
        </div>
      </section>
    </main>
  );
}
