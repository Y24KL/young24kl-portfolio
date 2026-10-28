import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useFinePointer } from '../lib/motion';

const SPRING = { stiffness: 160, damping: 20, mass: 0.6 };

// Perspective tilt with a soft specular highlight that follows the pointer.
// Only active on hover-capable fine pointers and when motion is allowed;
// otherwise children render flat (depth comes from static layering/shadows).
// Exposes --px / --py (0..1) so children can parallax their own layers.
export const Tilt = ({ children, max = 7, className = '', glare = true, as = 'div', ...rest }) => {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(600px circle at ${gx} ${gy}, rgb(255 236 190 / 0.16), transparent 45%)`;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { px.set(0.5); py.set(0.5); };

  const Comp = motion[as];

  if (!enabled) {
    return <Comp className={className} {...rest}>{children}</Comp>;
  }

  return (
    <Comp
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100, '--px': sx, '--py': sy }}
      className={`preserve-3d ${className}`}
      {...rest}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
          style={{ backgroundImage: light }}
        />
      )}
    </Comp>
  );
};

// Pulls its child gently toward the pointer. Small radius so the target never
// moves away from where the visitor is aiming.
export const Magnetic = ({ children, strength = 0.25, className = '' }) => {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });

  if (!fine || reduce) return <span className={`inline-flex ${className}`}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.span>
  );
};
