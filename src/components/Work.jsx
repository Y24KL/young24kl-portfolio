import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import Photo from './Photo';
import ProjectSheet from './ProjectSheet';
import { Tilt } from './Tilt';
import { EASE, inView, reveal, stagger } from '../lib/motion';
import { categoriesOf } from '../lib/projects';

// Asymmetric editorial rhythm, repeating every three projects.
const LAYOUT = [
  'md:col-span-7 lg:col-span-6',
  'md:col-span-5 lg:col-span-4 lg:col-start-8 md:mt-48',
  'md:col-span-6 md:col-start-4 lg:col-span-5 lg:col-start-3 md:-mt-10',
];

const pad = (n) => String(n).padStart(2, '0');

// A project rendered as a small stack of physical prints: the cover on top,
// two more frames tucked behind that fan out as the card tilts toward you.
const ProjectCard = ({ project, number, onOpen }) => {
  const images = project.media.filter((m) => m.type === 'image');
  const [cover, second, third] = images;
  const photos = images.length;

  return (
    <Tilt className="group relative" max={6}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${project.title}, ${photos} photos`}
        className="relative block w-full text-left [transform-style:preserve-3d]"
      >
        <div className="relative aspect-[4/5] [transform-style:preserve-3d]">
          {third && (
            <Photo
              image={third}
              alt=""
              sizes="25vw"
              className="!absolute inset-0 rounded-[4px] opacity-60 shadow-2xl transition-transform duration-700 ease-[var(--ease-cinema)] [transform:translate3d(3%,-2%,-60px)_rotate(3deg)] group-hover:[transform:translate3d(6%,-3.5%,-90px)_rotate(5deg)]"
            />
          )}
          {second && (
            <Photo
              image={second}
              alt=""
              sizes="25vw"
              className="!absolute inset-0 rounded-[4px] opacity-80 shadow-2xl transition-transform duration-700 ease-[var(--ease-cinema)] [transform:translate3d(-2%,-1.5%,-30px)_rotate(-2deg)] group-hover:[transform:translate3d(-4.5%,-3%,-45px)_rotate(-3.5deg)]"
            />
          )}
          <div className="absolute inset-0 overflow-hidden rounded-[4px] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.95)] ring-1 ring-white/[0.06] [transform:translateZ(0)]">
            <Photo
              image={cover}
              alt=""
              sizes="(min-width: 1024px) 45vw, (min-width: 768px) 55vw, 92vw"
              className="h-full w-full"
              imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-cinema)] group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(10_10_10/0.92)_100%)]" />
            <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-bone/90 text-ink opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100 max-md:bg-black/40 max-md:text-bone max-md:backdrop-blur">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="relative mt-6 flex items-start justify-between gap-6 [transform:translateZ(30px)]">
          <div className="min-w-0">
            <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-gold-pale">
              <span>{number}</span>
              <span className="h-px w-6 bg-gold-pale/50" />
              <span>{project.category || 'Collection'}</span>
            </p>
            <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-[1.05] text-bone transition-colors duration-300 group-hover:text-gold-light">
              {project.title}
            </h3>
          </div>
          <p className="shrink-0 pt-1 text-xs tracking-[0.18em] text-dim">{pad(photos)} frames</p>
        </div>
      </button>
    </Tilt>
  );
};

const Work = ({ projects, status }) => {
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);
  const categories = useMemo(() => categoriesOf(projects), [projects]);
  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter);
  const numberOf = (p) => pad(projects.indexOf(p) + 1);

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <motion.div variants={stagger(0.1)} {...inView} className="mb-16 grid gap-10 md:mb-24 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <motion.p variants={reveal} className="eyebrow mb-6">Selected work</motion.p>
            <motion.h2
              variants={reveal}
              id="work-title"
              className="font-display text-[clamp(2.75rem,6.5vw,6rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-bone"
            >
              Our <em className="font-medium italic text-gold-light">masterpieces</em>
              <sup className="ml-2 align-top font-sans text-base font-medium tracking-[0.1em] text-dim">({pad(projects.length)})</sup>
            </motion.h2>
          </div>
          <motion.p variants={reveal} className="max-w-sm text-base leading-relaxed text-mist md:col-span-4 md:justify-self-end">
            A curation of captured history, sports, and live moments. Open a project to see every frame.
          </motion.p>
        </motion.div>

        {categories.length > 1 && (
          <div role="group" aria-label="Filter projects" className="-mx-1 mb-14 flex flex-wrap gap-2 md:mb-20">
            {['All', ...categories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                className={`relative isolate min-h-11 rounded-full px-5 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  filter === c ? 'text-ink' : 'text-mist hover:text-bone'
                }`}
              >
                {filter === c && (
                  <motion.span layoutId="work-filter" className="absolute inset-0 -z-10 rounded-full bg-gold-light" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
                {c}
              </button>
            ))}
          </div>
        )}

        <LayoutGroup>
          <motion.ul layout className="grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-12 md:gap-y-28">
            <AnimatePresence mode="popLayout">
              {visible.map((project, i) => (
                <motion.li
                  key={project.key || project.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 1, ease: EASE }}
                  className={LAYOUT[i % LAYOUT.length]}
                >
                  <ProjectCard project={project} number={numberOf(project)} onOpen={() => setOpen(project)} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        <div className="mt-20 min-h-6 text-center text-sm text-dim" aria-live="polite">
          {status === 'loading' && (
            <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading the latest collections…</span>
          )}
          {status === 'error' && <span>Some recent collections couldn't be loaded. Refresh the page to try again.</span>}
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectSheet project={open} number={numberOf(open)} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Work;
