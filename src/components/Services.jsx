import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Photo from './Photo';
import logo from '../assets/logo.png';
import { EASE, inView, reveal, stagger, useFinePointer } from '../lib/motion';
import { services } from '../data/content';

const Visual = ({ service, className = '' }) =>
  service.image ? (
    <Photo image={service.image} alt="" sizes="(min-width: 1024px) 30vw, 40vw" className={className} />
  ) : (
    <div className={`grid place-items-center bg-[radial-gradient(circle_at_50%_40%,rgb(212_175_55/0.18),transparent_65%)] bg-charcoal ${className}`}>
      <img src={logo} alt="" className="w-2/5 rounded-full opacity-90" loading="lazy" />
    </div>
  );

// Editorial index of services. On desktop, hovering a row swaps the image in
// the sticky frame (decorative); on touch each row carries its own image.
const Services = () => {
  const fine = useFinePointer();
  const [active, setActive] = useState(0);

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <motion.div variants={stagger(0.1)} {...inView} className="mb-16 max-w-3xl md:mb-24">
          <motion.p variants={reveal} className="eyebrow mb-6">Our expertise</motion.p>
          <motion.h2
            variants={reveal}
            id="services-title"
            className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1] tracking-[-0.02em] text-bone"
          >
            Precision. Aesthetics. <em className="font-medium italic text-gold-light">Motion.</em>
          </motion.h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-12">
          <motion.ol variants={stagger(0.08)} {...inView} className="lg:col-span-7">
            {services.map((s, i) => (
              <motion.li key={s.title} variants={reveal}>
                <div
                  onPointerEnter={() => fine && setActive(i)}
                  className={`group grid grid-cols-[auto_1fr] gap-x-6 border-t border-white/[0.08] py-9 transition-colors duration-500 last:border-b md:gap-x-10 md:py-11 ${
                    fine && active === i ? 'text-bone' : ''
                  }`}
                >
                  <span className={`pt-2 font-sans text-xs font-semibold tracking-[0.24em] transition-colors duration-500 ${active === i || !fine ? 'text-gold-pale' : 'text-dim'}`}>
                    {s.num}
                  </span>
                  <div>
                    <h3
                      className={`font-display text-[clamp(1.9rem,3.6vw,3.25rem)] font-medium leading-none transition-[color,transform] duration-500 ease-[var(--ease-cinema)] ${
                        fine ? (active === i ? 'translate-x-2 text-bone' : 'text-bone/45') : 'text-bone'
                      }`}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-base leading-relaxed text-mist">{s.desc}</p>
                    {!fine && <Visual service={s} className="mt-7 aspect-[16/10] w-full rounded-[4px]" />}
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>

          {fine && (
            <div className="hidden lg:col-span-5 lg:block">
              <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[4px] shadow-[0_50px_100px_-40px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.06]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Visual service={services[active]} className="h-full w-full" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 text-[11px] font-semibold uppercase tracking-[0.26em]">
                  <span className="text-bone">{services[active].title}</span>
                  <span className="text-gold-pale">{services[active].num} / 0{services.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
