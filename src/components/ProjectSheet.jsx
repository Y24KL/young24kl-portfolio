import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Maximize2, Play } from 'lucide-react';
import Photo from './Photo';
import Lightbox from './Lightbox';
import { EASE, reveal, stagger } from '../lib/motion';
import { useModal } from '../lib/useModal';

// Project detail view: an editorial contact sheet of every frame in the
// collection, honouring each item's layoutSize from the CMS (standard / wide /
// tall). Selecting a frame opens it in the full-screen Lightbox.
const SPAN = {
  standard: 'aspect-[4/5]',
  wide: 'col-span-2 aspect-[8/5]',
  tall: 'row-span-2 h-full min-h-full',
};
const ProjectSheet = ({ project, number, onClose }) => {
  const ref = useModal(true, onClose);
  const [viewing, setViewing] = useState(null);
  const { media } = project;
  const photos = media.filter((m) => m.type === 'image').length;
  const videos = media.length - photos;

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-sheet-title"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
      transition={{ duration: 0.7, ease: EASE }}
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-ink"
    >
      <div className="sticky top-0 z-10 border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="container-x flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            className="group -ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-mist hover:text-bone"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            All work
          </button>
          <button type="button" onClick={() => setViewing(0)} className="btn btn-ghost !min-h-10 !px-4 text-[11px]">
            <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
          </button>
        </div>
      </div>

      <header className="container-x pb-12 pt-14 md:pb-16 md:pt-24">
        <p className="eyebrow mb-6">
          Project {number}
          {project.category ? ` · ${project.category}` : ''}
        </p>
        <h2
          id="project-sheet-title"
          className="max-w-5xl font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-bone"
        >
          {project.title}
        </h2>
        <div className="mt-8 flex flex-col gap-6 border-t border-white/[0.08] pt-6 md:flex-row md:items-start md:justify-between">
          {project.description ? (
            <p className="max-w-2xl whitespace-pre-line text-lg leading-relaxed text-mist">{project.description}</p>
          ) : <span />}
          <dl className="flex shrink-0 gap-10 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.24em] text-dim">Photos</dt>
              <dd className="mt-1 font-display text-3xl text-bone">{photos}</dd>
            </div>
            {videos > 0 && (
              <div>
                <dt className="text-[11px] uppercase tracking-[0.24em] text-dim">Films</dt>
                <dd className="mt-1 font-display text-3xl text-bone">{videos}</dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <motion.ul
        variants={stagger(0.06, 0.2)}
        initial="hidden"
        animate="visible"
        className="container-x grid grid-flow-dense grid-cols-2 gap-3 pb-24 md:gap-6 lg:grid-cols-3"
      >
        {media.map((item, i) => (
          <motion.li key={item.id + i} variants={reveal} className={SPAN[item.layoutSize] || SPAN.standard}>
            <button
              type="button"
              onClick={() => setViewing(i)}
              aria-label={`Open ${item.type === 'video' ? 'film' : 'photo'} ${i + 1} of ${media.length}`}
              className="group relative block h-full w-full overflow-hidden rounded-[4px]"
            >
              {item.type === 'video' ? (
                <span className="relative block h-full bg-charcoal">
                  <video src={item.src} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-black/30">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-bone/90 text-ink"><Play className="ml-0.5 h-5 w-5" /></span>
                  </span>
                </span>
              ) : (
                <Photo
                  image={item}
                  alt=""
                  sizes={item.layoutSize === 'wide' ? '(min-width: 1024px) 60vw, 95vw' : '(min-width: 1024px) 30vw, 48vw'}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-cinema)] group-hover:scale-[1.04]"
                />
              )}
              <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-bone/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          </motion.li>
        ))}
      </motion.ul>

      <AnimatePresence>
        {viewing !== null && (
          <Lightbox title={project.title} items={media} startIndex={viewing} onClose={() => setViewing(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectSheet;
