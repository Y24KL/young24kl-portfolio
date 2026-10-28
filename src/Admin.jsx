import { useEffect, useState } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { ArrowLeft, Loader2, Lock, LogOut, ShieldAlert } from 'lucide-react';

import { db } from './firebase';
import { auth } from './firebaseAdmin';
import AdminDashboard from './AdminDashboard';
import logo from './assets/logo.webp';

// Access model
// ------------
// 1. Firebase Auth (email/password) proves who you are.
// 2. A document at /admins/{uid} in Firestore says you're allowed in.
// The UI checks (2) only to show the right screen. The real enforcement is in
// firestore.rules and storage.rules, which reject writes from any UID not in
// /admins — so tampering with this code cannot grant access.

const AUTH_ERRORS = {
  'auth/invalid-credential': 'Incorrect email or password.',
  // Older projects (and the emulator) without email-enumeration protection:
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/invalid-email': 'That email address is not valid.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes, or reset your password.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/operation-not-allowed': 'Email/password sign-in is not enabled for this Firebase project.',
};
const authMessage = (error) => AUTH_ERRORS[error?.code] || 'Sign-in failed. Please try again.';

const Shell = ({ children }) => (
  <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-4 py-12 text-bone">
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.07] blur-[120px]" />
    <div className="relative w-full max-w-sm">{children}</div>
  </main>
);

const Brand = () => (
  <div className="mb-8 flex items-center gap-3">
    <img src={logo} alt="" className="h-11 w-11" />
    <div>
      <p className="font-display text-xl font-bold"><span className="text-gold-light">24KL</span> <span className="font-sans text-[0.6em] font-semibold tracking-[0.3em]">VISUALS</span></p>
      <p className="text-[11px] uppercase tracking-[0.24em] text-dim">Studio CMS</p>
    </div>
  </div>
);

const inputCls = 'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-bone outline-none transition focus:border-gold-pale focus:ring-4 focus:ring-gold/10';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setError('');
    setNotice('');
    if (!email.trim()) { setError('Enter your email above first, then choose “Forgot password”.'); return; }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      if (err?.code === 'auth/invalid-email' || err?.code === 'auth/network-request-failed') { setError(authMessage(err)); return; }
    }
    // Same message whether or not the account exists, to avoid revealing which emails are registered.
    setNotice('If that email belongs to an account, a reset link is on its way.');
  };

  return (
    <Shell>
      <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-white/[0.08] bg-[#0f0f10]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
        <Brand />
        <h1 className="mb-1 flex items-center gap-2 text-lg font-semibold"><Lock className="h-4 w-4 text-gold" /> Sign in</h1>
        <p className="mb-6 text-sm text-dim">Administrators only.</p>

        <label htmlFor="admin-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-mist">Email</label>
        <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mb-4`} />

        <label htmlFor="admin-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-mist">Password</label>
        <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} mb-2`} />
        <button type="button" onClick={handleReset} className="mb-6 text-xs text-dim underline-offset-4 hover:text-gold-light hover:underline">
          Forgot password?
        </button>

        <div aria-live="polite">
          {error && <p role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">{error}</p>}
          {notice && <p className="mb-4 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2.5 text-sm text-bone">{notice}</p>}
        </div>

        <button type="submit" disabled={busy || !email || !password} className="btn btn-gold w-full !tracking-[0.1em]">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : 'Sign in'}
        </button>

        <a href="/" className="mt-6 inline-flex items-center gap-1.5 text-xs text-dim transition-colors hover:text-gold-light">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to site
        </a>
      </form>
    </Shell>
  );
};

const FullScreenLoader = ({ label }) => (
  <div className="grid min-h-[100svh] place-items-center bg-ink">
    <div className="flex flex-col items-center gap-3 text-sm text-dim">
      <Loader2 className="h-7 w-7 animate-spin text-gold" />
      {label}
    </div>
  </div>
);

const COPY = {
  denied: {
    title: 'No admin access',
    body: (email) => <>You’re signed in as <span className="text-bone">{email}</span>, but this account isn’t on the administrator list. In the Firebase Console, add a document to the <code className="text-bone">admins</code> collection whose ID is the user ID below, then try again.</>,
  },
  // Firestore refused even to let us read our own /admins entry. With the
  // rules in this repo that can't happen, so the deployed rules are older.
  blocked: {
    title: 'Access check blocked',
    body: () => <>Firestore’s security rules blocked the admin check. This usually means the rules in this repository haven’t been deployed yet. Run <code className="text-bone">npx firebase-tools deploy --only firestore:rules --project young24kl</code>, make sure your user ID below is in the <code className="text-bone">admins</code> collection, then try again.</>,
  },
  error: {
    title: 'Couldn’t verify access',
    body: (email) => <>We couldn’t check whether <span className="text-bone">{email}</span> is an administrator. Check your connection and try again.</>,
  },
};

const NotAuthorized = ({ user, reason, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const { title, body } = COPY[reason] || COPY.error;

  const copyUid = async () => {
    try {
      await navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable; the ID is selectable */ }
  };

  return (
    <Shell>
      <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f10]/90 p-8 shadow-2xl">
        <Brand />
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <ShieldAlert className="h-5 w-5 text-red-300" />
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">{body(user.email)}</p>

        {reason !== 'error' && (
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">Your user ID</p>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 p-2 pl-3">
              <code className="min-w-0 flex-1 select-all break-all text-xs text-bone">{user.uid}</code>
              <button type="button" onClick={copyUid} className="shrink-0 rounded-md px-2.5 py-1.5 text-xs font-semibold text-gold-light hover:bg-white/5">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <button type="button" onClick={onRetry} className="btn btn-gold w-full">Try again</button>
          <button type="button" onClick={() => signOut(auth)} className="btn btn-ghost w-full">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <a href="/" className="mt-2 text-center text-xs text-dim hover:text-gold-light">Back to site</a>
        </div>
      </div>
    </Shell>
  );
};

// Subscribes to every project once access is confirmed.
function useProjects(enabled) {
  const [state, setState] = useState({ status: 'loading', projects: [], error: null });

  useEffect(() => {
    if (!enabled) return;
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => setState({
        status: 'ready',
        projects: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
        error: null,
      }),
      (error) => {
        console.error('Projects listener failed:', error);
        setState((s) => ({ ...s, status: 'error', error: error.message }));
      }
    );
  }, [enabled]);

  return state;
}

const AdminSession = ({ user }) => {
  const [access, setAccess] = useState('checking'); // checking | admin | denied | blocked | error
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getDoc(doc(db, 'admins', user.uid))
      .then((snap) => { if (!cancelled) setAccess(snap.exists() ? 'admin' : 'denied'); })
      .catch((error) => {
        console.error('Admin check failed:', error);
        if (!cancelled) setAccess(error.code === 'permission-denied' ? 'blocked' : 'error');
      });
    return () => { cancelled = true; };
  }, [user.uid, attempt]);

  const projects = useProjects(access === 'admin');

  if (access === 'checking') return <FullScreenLoader label="Checking access…" />;
  if (access !== 'admin') {
    return <NotAuthorized user={user} reason={access} onRetry={() => { setAccess('checking'); setAttempt((n) => n + 1); }} />;
  }

  return (
    <AdminDashboard
      user={user}
      projects={projects.projects}
      status={projects.status}
      loadError={projects.error}
      onSignOut={() => signOut(auth)}
    />
  );
};

const Admin = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    document.title = 'Studio CMS | 24KL Visuals';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => { unsubscribe(); robots.remove(); };
  }, []);

  if (user === undefined) return <FullScreenLoader label="Loading…" />;
  if (!user) return <LoginForm />;
  // Keyed by UID so switching accounts never leaks the previous session's state.
  return <AdminSession key={user.uid} user={user} />;
};

export default Admin;
