import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(relativePath) {
  const fullPath = join(root, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing file: ${relativePath}`);
  }
  return readFileSync(fullPath, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const main = read('src/main.tsx');
const login = read('src/pages/Login.tsx');
const register = read('src/pages/Register.tsx');
const dashboard = read('src/pages/Dashboard.tsx');

[
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/reset-password/:token',
  '/welcome',
  '/onboarding',
  '/profile',
  '*',
].forEach((route) => {
  assert(main.includes(route), `Route not registered: ${route}`);
});

[
  'src/pages/VerifyEmail.tsx',
  'src/pages/ForgotPassword.tsx',
  'src/pages/ResetPassword.tsx',
  'src/pages/ProfileOnboarding.tsx',
  'src/pages/NotFound.tsx',
  'src/components/IdentityExperience.tsx',
  'src/lib/identity.ts',
].forEach((file) => read(file));

assert(login.includes("api.post('/auth/login'"), 'Login must use existing auth login endpoint.');
assert(login.includes('/register'), 'Login must link to registration.');
assert(login.includes('/forgot-password'), 'Login must link to recovery.');
assert(register.includes("api.post('/auth/register'"), 'Register must use existing auth register endpoint.');
assert(register.includes('StepIndicator'), 'Register must expose the three-step journey.');
assert(register.includes('field-error'), 'Register must expose field-associated errors.');
assert(dashboard.includes('getIdentityKpis'), 'Dashboard must surface identity KPI context.');
assert(dashboard.includes('/auctions'), 'Dashboard must include the First Value Moment CTA.');

console.log('Identity journey smoke tests passed.');
