import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Photo from './Photo';
import Counter from './Counter';
import { inView, reveal, stagger } from '../lib/motion';
import { behindTheScenes, stats } from '../data/content';

const Vision = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);

  return (
    <section id="vision" ref={ref} aria-labelledby="vision-title" className="relative overflow-hidden border-y border-white/[0.06] bg-ink-2 py-28 md:py-40">
      <div className="container-x grid gap-16 md:grid-cols-12 md:gap-10">
        <motion.div variants={stagger(0.12)} {...inView} className="md:col-span-7 md:pr-8">
          <motion.p variants={reveal} className="eyebrow mb-8">The vision</motion.p>
          <motion.h2
            variants={reveal}
            id="vision-title"
            className="font-display text-[clamp(2rem,4.4vw,4rem)] font-medium leading-[1.12] tracking-[-0.015em] text-bone"
          >
            We don't just capture moments; we <em className="italic text-gold-light">architect cinematic experiences.</em>
          </motion.h2>
          <motion.p variants={reveal} className="mt-10 max-w-xl text-lg leading-relaxed text-mist">
            At Young24KL Studios, we were born from a passion for visual storytelling. Our studio
            merges high-end technology with raw creative intuition.
          </motion.p>

          <motion.dl variants={reveal} className="mt-16 grid grid-cols-3 border-t border-white/[0.08]">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col-reverse justify-end pt-8 ${i > 0 ? 'border-l border-white/[0.08] pl-4 sm:pl-8' : ''}`}>
                <dt className="mt-3 text-[10px] font-semibold uppercase leading-snug tracking-[0.2em] text-dim sm:text-[11px]">
                  {stat.label}
                </dt>
                <dd className="font-display text-[clamp(2.25rem,5vw,4rem)] font-medium leading-none text-gold-light">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.figure
          initial={{ clipPath: 'inset(12% 12% 12% 12%)', opacity: 0 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative md:col-span-5"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
            <motion.div className="absolute -inset-y-[10%] inset-x-0" style={{ y: imageY }}>
              <Photo image={behindTheScenes} sizes="(min-width: 768px) 40vw, 92vw" className="h-full w-full" />
            </motion.div>
          </div>
          <figcaption className="mt-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.26em] text-dim">
            <span>Behind the scenes</span>
            <span className="text-gold-pale">24KL</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
};

export default Vision;
