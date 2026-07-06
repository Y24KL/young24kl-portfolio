import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Loader2, Lock } from 'lucide-react';

import { db } from './firebase';
import { auth } from './firebaseAdmin';
import AdminDashboard from './AdminDashboard';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#0f0f0f] border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6 text-[#D4AF37]">
          <Lock className="w-5 h-5" />
          <h1 className="text-xl font-bold text-white">Studio CMS Login</h1>
        </div>

        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] outline-none mb-4"
        />

        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] outline-none mb-6"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#E5C06B] to-[#B48C36] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
        </button>

        <a href="/" className="block text-center text-xs text-gray-500 hover:text-[#D4AF37] mt-6 transition-colors">
          Back to site
        </a>
      </form>
    </div>
  );
};

const Admin = () => {
  const [user, setUser] = useState(undefined);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, [user]);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <AdminDashboard
      projects={projects}
      onExit={() => { window.location.href = '/'; }}
    />
  );
};

export default Admin;
