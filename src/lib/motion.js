// Shared motion language. Everything on the public site animates with these
// curves and durations so buttons, reveals, overlays and the gallery feel like
// one system. Framer's <MotionConfig reducedMotion="user"> (see App.jsx) turns
// transform animations off for visitors who ask for reduced motion; pointer
// tilt and parallax additionally check useReducedMotion() themselves.
import { useEffect, useState } from 'react';

export const EASE = [0.22, 1, 0.36, 1]; // long, soft deceleration
export const EASE_FILM = [0.65, 0, 0.35, 1]; // symmetric, for wipes and crossfades

export const DURATION = { fast: 0.2, base: 0.5, slow: 0.9, cinematic: 1.4 };

export const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE } },
};

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE } },
};

// For headline lines wrapped in an overflow-hidden mask.
export const lineRise = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 1.1, ease: EASE } },
};

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const inView = { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '0px 0px -12% 0px' } };

// True on devices with a precise pointer that can hover (mouse / trackpad).
// Tilt and magnetic effects only run there; touch gets static depth instead.
export function useFinePointer() {
  const query = '(hover: hover) and (pointer: fine)';
  const [fine, setFine] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setFine(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return fine;
}
