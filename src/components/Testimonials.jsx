import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE, inView, reveal, stagger } from '../lib/motion';
import { testimonials } from '../data/content';

// One quote at a time, set large; the client list doubles as the selector.
// No autoplay — visitors read at their own pace.
const Testimonials = () => {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section aria-labelledby="testimonials-title" className="relative border-y border-white/[0.06] bg-ink-2 py-28 md:py-40">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <motion.div variants={stagger(0.1)} {...inView} className="lg:col-span-4">
          <motion.p variants={reveal} className="eyebrow mb-6">Kind words</motion.p>
          <motion.h2 variants={reveal} id="testimonials-title" className="font-display text-4xl font-semibold leading-tight text-bone md:text-5xl">
            What clients say
          </motion.h2>

          <motion.div variants={reveal} role="tablist" aria-label="Testimonials" className="mt-12 flex flex-col border-t border-white/[0.08]">
            {testimonials.map((item, i) => (
              <button
                key={item.role}
                type="button"
                role="tab"
                id={`testimonial-tab-${i}`}
                aria-selected={i === active}
                aria-controls="testimonial-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); const n = (i + 1) % testimonials.length; setActive(n); document.getElementById(`testimonial-tab-${n}`)?.focus(); }
                  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); const n = (i - 1 + testimonials.length) % testimonials.length; setActive(n); document.getElementById(`testimonial-tab-${n}`)?.focus(); }
                }}
                className="group flex min-h-14 items-center justify-between border-b border-white/[0.08] text-left"
              >
                <span className={`text-sm font-medium tracking-wide transition-colors ${i === active ? 'text-bone' : 'text-dim group-hover:text-mist'}`}>
                  {item.role}
                </span>
                <span className={`h-px bg-gold-light transition-all duration-500 ease-[var(--ease-cinema)] ${i === active ? 'w-10' : 'w-0'}`} />
              </button>
            ))}
          </motion.div>
        </motion.div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div id="testimonial-panel" role="tabpanel" aria-labelledby={`testimonial-tab-${active}`} className="relative min-h-[18rem] md:min-h-[22rem]">
            <span aria-hidden className="pointer-events-none absolute -left-2 -top-16 select-none font-display text-[10rem] leading-none text-gold/15 md:-top-20 md:text-[13rem]">
              “
            </span>
            <AnimatePresence mode="wait">
              <motion.figure
                key={active}
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative"
              >
                <blockquote className="font-display text-[clamp(1.6rem,3vw,2.75rem)] font-normal italic leading-[1.3] text-bone">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span className="h-px w-10 bg-gold-pale" />
                  <span>
                    <span className="block text-sm font-semibold text-bone">{t.name}</span>
                    <span className="block text-sm text-gold-pale">{t.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
