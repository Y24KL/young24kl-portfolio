import { useEffect, useRef } from 'react';

// Shared behaviour for every overlay (menu, project sheet, lightbox):
// - locks page scroll while any overlay is open,
// - traps Tab focus inside the overlay,
// - Escape closes only the top-most overlay,
// - focus returns to whatever opened it.
const stack = [];
let saved = null; // body styles before the first overlay opened

export function useModal(open, onClose) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    const opener = document.activeElement;
    const entry = {};
    stack.push(entry);

    const { body } = document;
    if (stack.length === 1) {
      saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }

    const focusables = () =>
      [...(node?.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, video[controls], [tabindex]:not([tabindex="-1"])') ?? [])]
        .filter((el) => el.offsetParent !== null || el === document.activeElement);

    const focusFirst = requestAnimationFrame(() => {
      const target = node?.querySelector('[data-autofocus]') || focusables()[0] || node;
      target?.focus({ preventScroll: true });
    });

    const onKeyDown = (e) => {
      if (stack.at(-1) !== entry) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
      } else if (e.key === 'Tab') {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!node.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(focusFirst);
      document.removeEventListener('keydown', onKeyDown);
      stack.splice(stack.indexOf(entry), 1);
      if (stack.length === 0 && saved) {
        body.style.overflow = saved.overflow;
        body.style.paddingRight = saved.paddingRight;
        saved = null;
      }
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open]);

  return ref;
}
