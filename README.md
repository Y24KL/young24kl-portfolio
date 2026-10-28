# Young24KL Studios / 24KL Visuals — portfolio & Studio CMS

React 19 + Vite + Tailwind CSS 4 + Framer Motion, with Firebase (Firestore, Auth, Storage) for the `/admin` CMS.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server against the production Firebase project |
| `npm run dev:emulators` | Dev server against the local Firebase emulators (`.env.emulators`) |
| `npm run emulators` | Start Auth, Firestore and Storage emulators for the `demo-young24kl` project |
| `npm run seed` | Create emulator test accounts (`scripts/seed-emulators.mjs`); run while emulators are up |
| `npm run build` / `npm run preview` | Production build / serve it locally |
| `npm run lint` | ESLint |
| `npm test` | Security-rules tests + unit tests (starts the emulators; needs Java and `firebase-tools`) |
| `npm run test:unit` | Unit tests only (no emulators) |
| `npm run images` | Regenerate responsive WebP renditions from the JPG masters in `src/assets` |

## Adding photos to the bundled site

1. Drop the full-resolution JPG into `src/assets/`.
2. Run `npm run images` — it writes `src/assets/optimized/<name>-{640,1280,2048}.webp`, a blur placeholder and `manifest.json`.
3. Reference it with `photo('<name>', 'alt text')` in `src/data/content.js`.

The JPG masters are never shipped; only the WebP renditions are bundled.

## Firebase setup (required for the CMS to work in production)

The repository's rules are **not live until deployed**. As of this change the deployed Firestore rules deny public reads, so CMS collections do not appear on the site, and no Storage bucket exists, so uploads cannot work.

1. **Storage** — Firebase Console → Storage → *Get started*. New default buckets require the Blaze (pay-as-you-go) plan. If the bucket name differs from `young24kl.appspot.com` (newer projects use `young24kl.firebasestorage.app`), set `VITE_FIREBASE_STORAGE_BUCKET`.
2. **Auth** — Authentication → Sign-in method → enable **Email/Password**. Create the administrator account under *Users*. Optionally disable self sign-up (Settings → User actions), which the rules no longer rely on.
3. **Admin allowlist** — Firestore → create collection `admins`, add a document whose **ID is the admin user's UID** (from the Auth users table). Any field is fine, e.g. `email`. Only UIDs listed here can write.
4. **Deploy rules**:
   ```bash
   npx firebase-tools deploy --only firestore:rules,storage --project young24kl
   ```
   Storage rules read `/admins` from Firestore; the first deploy asks to grant Storage that permission — accept it.

## Hosting

The app is a single-page app: `/admin` must be rewritten to `index.html`. `vercel.json` (Vercel) and `public/_redirects` (Netlify) are included. For Firebase Hosting add a `hosting` block with `"rewrites": [{ "source": "**", "destination": "/index.html" }]`.

Set `VITE_SITE_URL` (e.g. `https://young24kl.com`) in the host's build settings so Open Graph previews use an absolute image URL; WhatsApp and Instagram ignore relative ones.

## Access model

Firebase Auth proves identity; the `/admins/{uid}` document grants permission. The admin UI checks the allowlist only to show the right screen. `firestore.rules` and `storage.rules` enforce it server-side, so editing client code cannot grant access. The Firebase web config in `src/firebase.js` is a public identifier, not a secret.
