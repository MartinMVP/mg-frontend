import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { recordIdentityEvent } from '../lib/identity';
import {
  FormField,
  IdentityShell,
  StatusNotice,
  StepIndicator,
} from '../components/IdentityExperience';

type RegisterErrors = Partial<{
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  terms: string;
  form: string;
}>;

const steps = ['Correo', 'Datos basicos', 'Seguridad'];

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getApiError(error: unknown) {
  const candidate = error as {
    response?: { status?: number; data?: { message?: string; error?: string } };
    message?: string;
  };
  const status = candidate.response?.status;
  const message = candidate.response?.data?.message ?? candidate.response?.data?.error;

  if (status === 409) return 'Ya existe una cuenta con ese correo.';
  if (status === 429) return 'Hay demasiados intentos. Espera unos minutos antes de continuar.';
  if (message) return message;
  if (candidate.message === 'Network Error') {
    return 'No pudimos conectar con el servicio. Revisa tu conexion e intenta de nuevo.';
  }
  return 'No pudimos crear la cuenta. Intenta nuevamente.';
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const passwordRules = useMemo(
    () => [
      { label: '8 caracteres', ok: password.length >= 8 },
      { label: 'mayuscula y minuscula', ok: /[A-Z]/.test(password) && /[a-z]/.test(password) },
      { label: 'numero', ok: /\d/.test(password) },
      { label: 'simbolo', ok: /[^A-Za-z0-9]/.test(password) },
    ],
    [password],
  );
  const strongPassword = passwordRules.every((rule) => rule.ok);

  function validateStep(targetStep = step) {
    const nextErrors: RegisterErrors = {};

    if (targetStep === 1 && !isEmail(email.trim())) {
      nextErrors.email = 'Escribe un correo valido para continuar.';
    }

    if (targetStep === 2 && name.trim().length < 2) {
      nextErrors.name = 'Escribe tu nombre completo o razon social.';
    }

    if (targetStep === 3) {
      if (!strongPassword) nextErrors.password = 'Usa una contrasena mas segura.';
      if (confirmPassword !== password) nextErrors.confirmPassword = 'Las contrasenas no coinciden.';
      if (!acceptedTerms) nextErrors.terms = 'Confirma que aceptas las condiciones de uso.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (step === 1) recordIdentityEvent('registration_started', { step: 'email' });
    setStep((current) => Math.min(current + 1, steps.length));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    setErrors({});
    try {
      await api.post('/auth/register', {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        password,
      });
      recordIdentityEvent('account_created', { emailDomain: email.split('@')[1] ?? 'unknown' });
      navigate(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (error) {
      setErrors({ form: getApiError(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <IdentityShell
      title="Crea tu cuenta"
      subtitle="Completa los datos indispensables para empezar en Enlace Ganadero."
    >
      <StepIndicator current={step} labels={steps} />

      {errors.form && (
        <StatusNotice tone="error" title="No pudimos completar el registro">
          <p>{errors.form}</p>
        </StatusNotice>
      )}

      <form className="identity-form" onSubmit={handleSubmit} noValidate>
        {step === 1 && (
          <FormField id="register-email" label="Correo electronico" error={errors.email}>
            <input
              autoComplete="email"
              id="register-email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@empresa.com"
              type="email"
              value={email}
            />
          </FormField>
        )}

        {step === 2 && (
          <FormField
            id="register-name"
            label="Nombre completo o razon social"
            error={errors.name}
            hint="Este nombre aparecera en tus operaciones internas."
          >
            <input
              autoComplete="name"
              id="register-name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Rancho El Encino"
              value={name}
            />
          </FormField>
        )}

        {step === 3 && (
          <>
            <FormField id="register-password" label="Contrasena segura" error={errors.password}>
              <input
                autoComplete="new-password"
                id="register-password"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </FormField>
            <ul className="password-rules" aria-label="Requisitos de contrasena">
              {passwordRules.map((rule) => (
                <li className={rule.ok ? 'is-ok' : ''} key={rule.label}>
                  {rule.label}
                </li>
              ))}
            </ul>
            <FormField
              id="register-confirm-password"
              label="Confirma la contrasena"
              error={errors.confirmPassword}
            >
              <input
                autoComplete="new-password"
                id="register-confirm-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                type="password"
                value={confirmPassword}
              />
            </FormField>
            <label className="check-row" htmlFor="register-terms">
              <input
                checked={acceptedTerms}
                id="register-terms"
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                type="checkbox"
              />
              Acepto operar con informacion real y mantener mis datos actualizados.
            </label>
            {errors.terms && <p className="field-error">{errors.terms}</p>}
          </>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button className="secondary-button" onClick={() => setStep(step - 1)} type="button">
              Volver
            </button>
          )}
          {step < steps.length ? (
            <button type="button" onClick={handleNext}>
              Continuar
            </button>
          ) : (
            <button disabled={loading} type="submit">
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          )}
        </div>
      </form>

      <p className="identity-footer">
        Ya tienes cuenta? <Link to="/">Inicia sesion</Link>
      </p>
    </IdentityShell>
  );
}
