import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { EASE } from '../lib/motion';
import { useModal } from '../lib/useModal';

const SWIPE = 60;

function preload(item) {
  if (!item || item.type === 'video') return;
  const img = new Image();
  if (item.srcSet) { img.sizes = '100vw'; img.srcset = item.srcSet; }
  img.src = item.full || item.src;
}

// Full-screen viewer. Arrow keys / buttons / swipe navigate, Escape closes,
// focus is trapped inside while open and restored on close.
const Lightbox = ({ title, items, startIndex = 0, onClose }) => {
  const ref = useModal(true, onClose);
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState([startIndex, 0]);
  const count = items.length;
  const item = items[index];

  const go = useCallback(
    (step) => setState(([i]) => [(i + step + count) % count, step]),
    [count]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go]);

  useEffect(() => {
    preload(items[(index + 1) % count]);
    preload(items[(index - 1 + count) % count]);
  }, [index, items, count]);

  const offset = reduce ? 0 : 80;

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — photo viewer`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-0 z-[90] flex flex-col bg-black/[0.97] backdrop-blur-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 md:px-8">
        <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.28em] text-mist">
          {title}
          <span className="ml-3 text-bone" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </p>
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label="Close viewer"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.06] text-bone transition-colors hover:bg-white/[0.14]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 md:px-24">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={item.id + index}
            custom={dir}
            initial={{ opacity: 0, x: dir * offset, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -offset, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.55, ease: EASE }}
            drag={count > 1 && item.type !== 'video' ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE) go(1);
              else if (info.offset.x > SWIPE) go(-1);
            }}
            className="flex h-full w-full touch-pan-y items-center justify-center"
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                controls
                playsInline
                preload="metadata"
                className="max-h-full max-w-full rounded-md shadow-2xl"
              />
            ) : (
              <img
                src={item.full || item.src}
                srcSet={item.srcSet}
                sizes="100vw"
                alt={item.alt || `${title}, photo ${index + 1} of ${count}`}
                draggable={false}
                className="max-h-full max-w-full select-none rounded-[3px] object-contain shadow-[0_40px_120px_-30px_rgb(0_0_0/1)]"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/40 text-bone backdrop-blur-md transition-colors hover:border-gold-pale hover:text-gold-light md:left-8 md:grid"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/40 text-bone backdrop-blur-md transition-colors hover:border-gold-pale hover:text-gold-light md:right-8 md:grid"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-3 px-4 py-4">
          {/* Touch: large prev/next; desktop: thumbnail rail */}
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-bone md:hidden">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="hidden max-w-full gap-2 overflow-x-auto md:flex" role="group" aria-label="Photos in this project">
            {items.map((m, i) => (
              <button
                key={m.id + i}
                type="button"
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className={`relative h-14 w-11 shrink-0 overflow-hidden rounded-[3px] transition-all duration-300 ${
                  i === index ? 'opacity-100 ring-1 ring-gold-light' : 'opacity-40 hover:opacity-80'
                }`}
              >
                {m.type === 'video' ? (
                  <video src={m.src} muted preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  <img src={m.placeholder || m.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
              </button>
            ))}
          </div>
          <span className="text-xs tracking-[0.2em] text-mist md:hidden">Swipe</span>
          <button type="button" onClick={() => go(1)} aria-label="Next photo" className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-bone md:hidden">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Lightbox;
