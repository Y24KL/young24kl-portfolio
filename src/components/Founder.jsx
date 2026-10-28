import { motion } from 'framer-motion';
import Photo from './Photo';
import { Tilt } from './Tilt';
import { inView, reveal, stagger } from '../lib/motion';
import { founderPortrait } from '../data/content';

const Founder = () => (
  <section id="team" aria-labelledby="team-title" className="relative py-28 md:py-40">
    <div className="container-x grid items-center gap-14 md:grid-cols-12 md:gap-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="md:col-span-5"
      >
        <Tilt max={5} className="group relative mx-auto max-w-md">
          {/* Offset gold frame sits behind the portrait for physical depth */}
          <div aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-[4px] border border-gold/40 [transform:translateZ(-40px)]" />
          <div className="relative overflow-hidden rounded-[4px] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.95)]">
            <Photo image={founderPortrait} sizes="(min-width: 768px) 35vw, 90vw" className="aspect-[4/5] w-full" />
          </div>
        </Tilt>
      </motion.div>

      <motion.div variants={stagger(0.1)} {...inView} className="md:col-span-6 md:col-start-7">
        <motion.p variants={reveal} className="eyebrow mb-6">Founder & creative director</motion.p>
        <motion.h2
          variants={reveal}
          id="team-title"
          className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.02em] text-bone"
        >
          The mind behind <em className="font-medium italic text-gold-light">the lens</em>
        </motion.h2>
        <motion.p variants={reveal} className="mt-8 text-xl font-medium tracking-wide text-bone">
          Gamaliel Godfrey Balanku
        </motion.p>
        <motion.p variants={reveal} className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
          With years of experience pushing the boundaries of digital media, our CEO established
          Young24KL Studios to bridge the gap between imagination and reality. Known for a
          meticulous eye for detail and an uncompromising standard of excellence.
        </motion.p>
      </motion.div>
    </div>
  </section>
);

export default Founder;
