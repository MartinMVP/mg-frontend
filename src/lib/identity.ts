export type IdentityProfile = {
  activity: string;
  state: string;
  operationScale: string;
  phone?: string;
  interests: string[];
  completedAt: string;
};

export type IdentityEventType =
  | 'registration_started'
  | 'account_created'
  | 'email_verification_instruction_viewed'
  | 'password_recovery_started'
  | 'password_recovery_blocked'
  | 'first_access_success'
  | 'initial_profile_completed'
  | 'identity_step_abandoned';

type IdentityEvent = {
  type: IdentityEventType;
  at: string;
  metadata?: Record<string, string | number | boolean>;
};

const PROFILE_KEY = 'eg_identity_profile';
const EVENTS_KEY = 'eg_identity_events';
const MAX_EVENTS = 100;

export function getIdentityProfile(): IdentityProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as IdentityProfile) : null;
  } catch {
    return null;
  }
}

export function saveIdentityProfile(profile: IdentityProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function isIdentityProfileComplete(profile = getIdentityProfile()) {
  return Boolean(profile?.activity && profile.state && profile.operationScale);
}

export function recordIdentityEvent(
  type: IdentityEventType,
  metadata?: IdentityEvent['metadata'],
) {
  try {
    const current = getIdentityEvents();
    const next = [{ type, at: new Date().toISOString(), metadata }, ...current].slice(
      0,
      MAX_EVENTS,
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(next));
  } catch {
    // Local metrics must never block the identity journey.
  }
}

export function getIdentityEvents(): IdentityEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? (JSON.parse(raw) as IdentityEvent[]) : [];
  } catch {
    return [];
  }
}

export function getIdentityKpis() {
  const events = getIdentityEvents();
  const count = (type: IdentityEventType) =>
    events.filter((event) => event.type === type).length;

  return {
    registrationStarted: count('registration_started'),
    accountsCreated: count('account_created'),
    verificationInstructionsViewed: count('email_verification_instruction_viewed'),
    firstAccessSuccess: count('first_access_success'),
    initialProfileCompleted: count('initial_profile_completed'),
    passwordRecoveriesStarted: count('password_recovery_started'),
    passwordRecoveriesBlocked: count('password_recovery_blocked'),
  };
}
