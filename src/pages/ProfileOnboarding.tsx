import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField, IdentityShell, StatusNotice } from '../components/IdentityExperience';
import {
  getIdentityProfile,
  recordIdentityEvent,
  saveIdentityProfile,
} from '../lib/identity';

const interests = [
  'Comprar ganado',
  'Vender ganado',
  'Subastas',
  'Publicaciones destacadas',
  'Mensajeria comercial',
];

export default function ProfileOnboarding() {
  const navigate = useNavigate();
  const stored = getIdentityProfile();
  const [activity, setActivity] = useState(stored?.activity ?? '');
  const [state, setState] = useState(stored?.state ?? '');
  const [operationScale, setOperationScale] = useState(stored?.operationScale ?? '');
  const [phone, setPhone] = useState(stored?.phone ?? '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(stored?.interests ?? []);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  function toggleInterest(value: string) {
    setSelectedInterests((current) =>
      current.includes(value)
        ? current.filter((interest) => interest !== value)
        : [...current, value],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activity || !state || !operationScale) {
      setError('Completa actividad, estado y escala de operacion.');
      return;
    }
    setError('');
    saveIdentityProfile({
      activity,
      state,
      operationScale,
      phone: phone.trim(),
      interests: selectedInterests,
      completedAt: new Date().toISOString(),
    });
    recordIdentityEvent('initial_profile_completed', { activity, operationScale });
    setSaved(true);
  }

  return (
    <IdentityShell
      eyebrow="Perfil inicial"
      title="Completa tu perfil operativo"
      subtitle="Estos datos preparan tu experiencia inicial sin modificar contratos backend."
    >
      <StatusNotice tone="info" title="Guardado frontend">
        <p>
          El perfil inicial se conserva localmente hasta que exista un endpoint publico de perfil.
        </p>
      </StatusNotice>

      {error && (
        <StatusNotice tone="error" title="Falta informacion">
          <p>{error}</p>
        </StatusNotice>
      )}
      {saved && (
        <StatusNotice tone="success" title="Perfil inicial listo">
          <p>Ya puedes entrar al dashboard y explorar el marketplace.</p>
        </StatusNotice>
      )}

      <form className="identity-form" onSubmit={handleSubmit} noValidate>
        <FormField id="profile-activity" label="Actividad principal">
          <select
            id="profile-activity"
            onChange={(event) => setActivity(event.target.value)}
            value={activity}
          >
            <option value="">Selecciona una opcion</option>
            <option value="buyer">Comprador</option>
            <option value="seller">Vendedor</option>
            <option value="both">Compra y venta</option>
            <option value="advisor">Asesor o administrador</option>
          </select>
        </FormField>
        <FormField id="profile-state" label="Estado de operacion">
          <input
            id="profile-state"
            onChange={(event) => setState(event.target.value)}
            placeholder="Sonora"
            value={state}
          />
        </FormField>
        <FormField id="profile-scale" label="Escala de operacion">
          <select
            id="profile-scale"
            onChange={(event) => setOperationScale(event.target.value)}
            value={operationScale}
          >
            <option value="">Selecciona una escala</option>
            <option value="small">1 a 20 animales</option>
            <option value="medium">21 a 100 animales</option>
            <option value="large">Mas de 100 animales</option>
          </select>
        </FormField>
        <FormField id="profile-phone" label="Telefono de contacto" hint="Opcional">
          <input
            autoComplete="tel"
            id="profile-phone"
            inputMode="tel"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="662 000 0000"
            value={phone}
          />
        </FormField>

        <fieldset className="interest-fieldset">
          <legend>Intereses iniciales</legend>
          {interests.map((interest) => (
            <label className="check-row" htmlFor={`interest-${interest}`} key={interest}>
              <input
                checked={selectedInterests.includes(interest)}
                id={`interest-${interest}`}
                onChange={() => toggleInterest(interest)}
                type="checkbox"
              />
              {interest}
            </label>
          ))}
        </fieldset>

        <div className="form-actions">
          <button type="submit">Guardar perfil</button>
          {saved ? (
            <button onClick={() => navigate('/dashboard')} type="button">
              Ir al dashboard
            </button>
          ) : (
            <Link className="secondary-link" to="/dashboard">
              Completar despues
            </Link>
          )}
        </div>
      </form>
    </IdentityShell>
  );
}
