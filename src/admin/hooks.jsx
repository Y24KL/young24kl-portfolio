import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DialogBody } from './ui';

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback(
    (tone, message) => {
      const id = ++nextId.current;
      setToasts((t) => [...t.slice(-3), { id, tone, message }]);
      // Errors stay until dismissed so they can't be missed.
      if (tone !== 'error') setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
}

// Usage: const confirm = useConfirm(); ... await confirm.ask({...}) -> boolean
// The action runs inside the dialog so it can show progress and stay open on failure.
export function useConfirm() {
  const [state, setState] = useState(null);

  const ask = useCallback((options) => setState({ ...options, busy: false }), []);
  const close = useCallback(() => setState(null), []);

  const run = async () => {
    setState((s) => ({ ...s, busy: true }));
    const ok = await state.action().then(() => true, () => false);
    if (ok) setState(null);
    else setState((s) => (s ? { ...s, busy: false } : s));
  };

  const dialog = (
    <AnimatePresence>
      {state && (
        <DialogBody
          title={state.title}
          confirmLabel={state.confirmLabel}
          danger={state.danger}
          busy={state.busy}
          requireText={state.requireText}
          onConfirm={run}
          onCancel={close}
        >
          {state.body}
        </DialogBody>
      )}
    </AnimatePresence>
  );

  return { ask, dialog };
}

