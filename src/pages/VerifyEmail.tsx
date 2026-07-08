import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  IdentityShell,
  StatusNotice,
} from '../components/IdentityExperience';
import { recordIdentityEvent } from '../lib/identity';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = useMemo(() => params.get('email') ?? '', [params]);
  const [resent, setResent] = useState(false);

  function handleResend() {
    setResent(true);
    recordIdentityEvent('email_verification_instruction_viewed', { requestedResend: true });
  }

  return (
    <IdentityShell
      eyebrow="Verificacion"
      title="Revisa tu correo"
      subtitle="Tu cuenta fue creada. Sigue las instrucciones disponibles para confirmar identidad."
    >
      <StatusNotice tone="success" title="Cuenta creada">
        <p>
          {email
            ? `Te mostramos esta confirmacion para ${email}.`
            : 'Te mostramos esta confirmacion para tu correo registrado.'}
        </p>
      </StatusNotice>

      <StatusNotice tone="warning" title="Verificacion pendiente de backend">
        <p>
          El frontend ya presenta el paso de verificacion. El backend actual no expone un endpoint
          publico para enviar o confirmar tokens de correo, por lo que no se dispara ningun cambio
          tecnico desde esta pantalla.
        </p>
      </StatusNotice>

      {resent && (
        <StatusNotice tone="info" title="Solicitud registrada en la experiencia">
          <p>
            No se envio un correo nuevo porque el endpoint de reenvio no esta disponible en el
            contrato actual.
          </p>
        </StatusNotice>
      )}

      <div className="form-actions">
        <button onClick={handleResend} type="button">
          Reenviar verificacion
        </button>
        <Link className="secondary-link" to="/">
          Ir a iniciar sesion
        </Link>
      </div>
    </IdentityShell>
  );
}
