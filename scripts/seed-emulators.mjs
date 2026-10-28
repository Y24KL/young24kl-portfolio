// Seeds the local Firebase emulators (never production) with two test accounts:
//   admin@young24kl.test  — listed in /admins, can manage the CMS
//   viewer@young24kl.test — signed-in but NOT an admin, must be refused
// Run after `npm run emulators`:  node scripts/seed-emulators.mjs
const PROJECT = 'demo-young24kl';
const AUTH = 'http://127.0.0.1:9099';
const FIRESTORE = 'http://127.0.0.1:8085';
const PASSWORD = 'emulator-only-pass-123';

async function signUp(email) {
  const res = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD, returnSecureToken: true }),
  });
  const body = await res.json();
  if (body.error?.message === 'EMAIL_EXISTS') {
    const login = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: PASSWORD, returnSecureToken: true }),
    });
    return (await login.json()).localId;
  }
  if (!res.ok) throw new Error(JSON.stringify(body));
  return body.localId;
}

const adminUid = await signUp('admin@young24kl.test');
await signUp('viewer@young24kl.test');

// "Bearer owner" bypasses security rules on the emulator only.
const res = await fetch(
  `${FIRESTORE}/v1/projects/${PROJECT}/databases/(default)/documents/admins?documentId=${adminUid}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
    body: JSON.stringify({ fields: { email: { stringValue: 'admin@young24kl.test' } } }),
  }
);
if (!res.ok && res.status !== 409) throw new Error(await res.text());
console.log('Seeded emulator admin', adminUid);
