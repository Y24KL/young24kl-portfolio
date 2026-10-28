import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Photo from './Photo';
import { archiveFrames } from '../data/content';

// A strip of archive frames that drifts sideways as the page scrolls past —
// movement tied to the visitor's own scrolling, never autoplaying.
const FilmStrip = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['-10%', '-10%'] : ['0%', '-22%']);

  return (
    <section ref={ref} aria-label="From the archive" className="relative overflow-hidden py-16 md:py-24">
      <div className="container-x mb-8 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-dim">
        <span>From the archive</span>
        <span className="hidden sm:inline">Portraits · Events · Courtside</span>
      </div>
      <motion.ul style={{ x }} className="flex w-max gap-4 pl-5 md:gap-6 md:pl-12">
        {archiveFrames.map((frame, i) => (
          <li
            key={frame.id}
            className={`relative shrink-0 overflow-hidden rounded-[3px] ${
              frame.width > frame.height ? 'aspect-[3/2] h-[38vw] max-h-[340px] md:h-[24vw]' : 'aspect-[4/5] h-[38vw] max-h-[340px] md:h-[24vw]'
            } ${i % 2 ? 'mt-8 md:mt-14' : ''}`}
          >
            <Photo image={frame} sizes="(min-width: 768px) 30vw, 50vw" className="h-full w-full grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0" />
          </li>
        ))}
      </motion.ul>
    </section>
  );
};

export default FilmStrip;
