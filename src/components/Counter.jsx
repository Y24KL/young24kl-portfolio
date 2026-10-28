import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

// Counts up once when scrolled into view. Screen readers get the final value
// immediately; reduced-motion visitors see it without the count.
const Counter = ({ value, suffix = '', duration = 1.8 }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!isInView || reduce) return;
    let start = null;
    let frame;
    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden>{(reduce ? value : display).toLocaleString()}{suffix}</span>
      <span className="sr-only">{value.toLocaleString()}{suffix}</span>
    </span>
  );
};

export default Counter;
