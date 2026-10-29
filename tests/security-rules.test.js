// Security-rules regression tests. Run with `npm test` (starts the Firestore
// and Storage emulators for the demo project, so production is never touched).
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref, uploadBytes } from 'firebase/storage';

const PROJECT_ID = 'demo-young24kl';
const ADMIN_UID = 'admin-uid';
const USER_UID = 'ordinary-user';

const project = {
  title: 'TEST COLLECTION',
  images: [],
  createdAt: '2026-01-01T00:00:00.000Z',
};

let env;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8085 },
    storage: { rules: readFileSync('storage.rules', 'utf8'), host: '127.0.0.1', port: 9199 },
  });
});

afterAll(() => env.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'admins', ADMIN_UID), { email: 'admin@example.test' });
    await setDoc(doc(db, 'projects', 'existing'), project);
  });
});

const adminDb = () => env.authenticatedContext(ADMIN_UID).firestore();
const userDb = () => env.authenticatedContext(USER_UID).firestore();
const anonDb = () => env.unauthenticatedContext().firestore();

describe('projects collection', () => {
  it('is publicly readable', async () => {
    await assertSucceeds(getDoc(doc(anonDb(), 'projects', 'existing')));
  });

  it('rejects writes from visitors', async () => {
    await assertFails(setDoc(doc(anonDb(), 'projects', 'new'), project));
  });

  // Regression: the old rule was `allow write: if request.auth != null`, which
  // let any self-registered Firebase Auth account edit the portfolio.
  it('rejects writes from signed-in users who are not admins', async () => {
    await assertFails(setDoc(doc(userDb(), 'projects', 'new'), project));
    await assertFails(updateDoc(doc(userDb(), 'projects', 'existing'), { title: 'HACKED' }));
    await assertFails(deleteDoc(doc(userDb(), 'projects', 'existing')));
  });

  it('lets admins create, edit and delete projects', async () => {
    await assertSucceeds(setDoc(doc(adminDb(), 'projects', 'new'), project));
    await assertSucceeds(
      updateDoc(doc(adminDb(), 'projects', 'existing'), {
        title: 'RENAMED',
        description: 'A short description.',
        category: 'Sports',
        updatedAt: '2026-01-02T00:00:00.000Z',
      })
    );
    await assertSucceeds(deleteDoc(doc(adminDb(), 'projects', 'existing')));
  });

  it('validates project fields', async () => {
    await assertFails(setDoc(doc(adminDb(), 'projects', 'bad1'), { ...project, title: '' }));
    await assertFails(setDoc(doc(adminDb(), 'projects', 'bad2'), { ...project, images: 'nope' }));
    await assertFails(setDoc(doc(adminDb(), 'projects', 'bad3'), { ...project, isAdmin: true }));
    await assertFails(updateDoc(doc(adminDb(), 'projects', 'existing'), { createdAt: 'changed' }));
  });
});

describe('settings collection', () => {
  const flag = { featuredImported: true, updatedAt: '2026-01-01T00:00:00.000Z' };

  it('is publicly readable', async () => {
    await assertSucceeds(getDoc(doc(anonDb(), 'settings', 'site')));
  });

  it('can only be written by admins, with known fields', async () => {
    await assertFails(setDoc(doc(userDb(), 'settings', 'site'), flag));
    await assertFails(setDoc(doc(anonDb(), 'settings', 'site'), flag));
    await assertSucceeds(setDoc(doc(adminDb(), 'settings', 'site'), flag));
    await assertFails(setDoc(doc(adminDb(), 'settings', 'site'), { ...flag, theme: 'red' }));
    await assertFails(setDoc(doc(adminDb(), 'settings', 'site'), { featuredImported: 'yes' }));
  });
});

describe('admins collection', () => {
  it('lets a user check only their own admin status', async () => {
    await assertSucceeds(getDoc(doc(adminDb(), 'admins', ADMIN_UID)));
    await assertSucceeds(getDoc(doc(userDb(), 'admins', USER_UID)));
    await assertFails(getDoc(doc(userDb(), 'admins', ADMIN_UID)));
    await assertFails(getDoc(doc(anonDb(), 'admins', ADMIN_UID)));
  });

  it('cannot be written from the client, so users cannot promote themselves', async () => {
    await assertFails(setDoc(doc(userDb(), 'admins', USER_UID), { email: 'me@example.test' }));
    await assertFails(setDoc(doc(adminDb(), 'admins', USER_UID), { email: 'friend@example.test' }));
  });
});

describe('storage', () => {
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

  it('lets admins upload and delete images', async () => {
    const storage = env.authenticatedContext(ADMIN_UID).storage();
    const fileRef = ref(storage, 'portfolio/existing/test.png');
    await assertSucceeds(uploadBytes(fileRef, png, { contentType: 'image/png' }));
    await assertSucceeds(deleteObject(fileRef));
  });

  it('rejects uploads from non-admins and non-media files', async () => {
    const userStorage = env.authenticatedContext(USER_UID).storage();
    await assertFails(uploadBytes(ref(userStorage, 'portfolio/x/test.png'), png, { contentType: 'image/png' }));
    const adminStorage = env.authenticatedContext(ADMIN_UID).storage();
    await assertFails(uploadBytes(ref(adminStorage, 'portfolio/x/run.js'), png, { contentType: 'text/javascript' }));
    await assertFails(uploadBytes(ref(adminStorage, 'other/test.png'), png, { contentType: 'image/png' }));
  });
});
