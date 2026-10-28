import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, Loader2, X } from 'lucide-react';
import { useModal } from '../lib/useModal';

// Small, dependency-free UI kit for the CMS: toasts and a confirm dialog.
// State hooks live in hooks.jsx.

const TONES = {
  success: { icon: CheckCircle2, cls: 'border-emerald-400/25 text-emerald-200' },
  error: { icon: AlertTriangle, cls: 'border-red-400/30 text-red-200' },
  info: { icon: Info, cls: 'border-gold/30 text-bone' },
};

export const Toasts = ({ toasts, dismiss }) => (
  <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end">
    <AnimatePresence initial={false}>
      {toasts.map((t) => {
        const { icon: Icon, cls } = TONES[t.tone];
        return (
          <motion.div
            key={t.id}
            layout
            role={t.tone === 'error' ? 'alert' : 'status'}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-[#141416]/95 p-4 text-sm shadow-2xl backdrop-blur ${cls}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1 leading-snug">{t.message}</p>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="-m-1 rounded p-1 text-mist hover:text-bone">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);

export const DialogBody = ({ title, children, confirmLabel, danger, busy, requireText, onConfirm, onCancel }) => {
  const ref = useModal(true, busy ? undefined : onCancel);
  const [typed, setTyped] = useState('');
  const blocked = busy || (requireText && typed.trim() !== requireText);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onCancel(); }}
    >
      <motion.div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        initial={{ y: 12, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111113] p-6 shadow-2xl"
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-bone">{title}</h2>
        <div className="mt-3 text-sm leading-relaxed text-mist">{children}</div>
        {requireText && (
          <label className="mt-5 block text-xs text-mist">
            Type <span className="font-semibold text-bone">{requireText}</span> to confirm
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              data-autofocus
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-base text-bone outline-none focus:border-gold-pale"
            />
          </label>
        )}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={busy} data-autofocus={requireText ? undefined : true} className="min-h-11 rounded-lg border border-white/10 px-4 text-sm font-medium text-bone hover:bg-white/5 disabled:opacity-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={blocked}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:opacity-50 ${
              danger ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-gold-light text-ink hover:bg-gold'
            }`}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Spinner = ({ className = 'h-4 w-4' }) => <Loader2 className={`animate-spin ${className}`} />;
