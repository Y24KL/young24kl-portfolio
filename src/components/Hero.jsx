import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowRight, Pause, Play } from 'lucide-react';
import Photo from './Photo';
import { Magnetic } from './Tilt';
import { EASE, EASE_FILM, lineRise, stagger, useFinePointer } from '../lib/motion';
import { heroPrint, heroSlides } from '../data/content';

const SLIDE_MS = 6500;
const POINTER_SPRING = { stiffness: 60, damping: 18, mass: 0.8 };

const HEADLINE = [
  <>Creating visual</>,
  <>masterpieces,</>,
  <><em className="font-display italic font-medium text-gold-light">one frame</em> at a time.</>,
];

function useCarousel(count, autoplay) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const running = autoplay && !paused;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, running, count]);

  // Warm the cache for the next slide so the wipe never reveals a blank frame.
  useEffect(() => {
    const next = heroSlides[(index + 1) % count];
    const img = new Image();
    img.sizes = '100vw';
    img.srcset = next.srcSet;
    img.src = next.src;
  }, [index, count]);

  return { index, setIndex, paused, setPaused, running };
}

const Hero = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const parallax = fine && !reduce;
  const { index, setIndex, paused, setPaused, running } = useCarousel(heroSlides.length, !reduce);

  // Pointer depth: each layer moves by a different amount.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, POINTER_SPRING);
  const sy = useSpring(my, POINTER_SPRING);
  const plateX = useTransform(sx, (v) => v * -22);
  const plateY = useTransform(sy, (v) => v * -14);
  const printX = useTransform(sx, (v) => v * 38);
  const printY = useTransform(sy, (v) => v * 26);
  const printRotY = useTransform(sx, (v) => -8 + v * 10);
  const printRotX = useTransform(sy, (v) => 4 - v * 8);
  const textX = useTransform(sx, (v) => v * 8);

  // Scroll depth: plate sinks, print rises, copy drifts and fades.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scrollPlate = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '16%']);
  const scrollPrint = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-30%']);
  const scrollText = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '22%']);
  const fadeOut = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const onPointerMove = (e) => {
    if (!parallax) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const slide = heroSlides[index];

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink pt-32 [perspective:1400px]"
    >
      {/* Layer 1 — photographic plate */}
      <motion.div className="absolute -inset-[3%] -z-20" style={{ x: plateX, y: plateY }}>
        <motion.div className="absolute inset-0" style={{ y: scrollPlate }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 0 100%)', zIndex: 2 }}
              animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0 0%)', zIndex: 2 }}
              exit={reduce ? { opacity: 0 } : { zIndex: 1, transition: { duration: 1.4 } }}
              transition={{ duration: reduce ? 0.6 : 1.4, ease: EASE_FILM }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.14 }}
                animate={{ scale: 1.02 }}
                transition={{ duration: SLIDE_MS / 1000 + 1.4, ease: 'linear' }}
              >
                <Photo image={slide} priority={index === 0} sizes="100vw" className="h-full w-full" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Cinematic grade: legibility on the left, fade into the page below */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(10_10_10/0.94)_0%,rgb(10_10_10/0.78)_38%,rgb(10_10_10/0.25)_72%,rgb(10_10_10/0.05)_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_10_10/0.75)_0%,transparent_24%,rgb(10_10_10/0.25)_60%,#0a0a0a_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_30%,rgb(212_175_55/0.12),transparent_55%)]" />

      {/* Layer 2 — floating print (desktop only; touch keeps the plate clean) */}
      <motion.div
        aria-hidden
        style={{ y: scrollPrint }}
        className="absolute bottom-[16%] right-[6%] -z-[5] hidden w-[clamp(200px,17vw,300px)] xl:block"
      >
        <motion.figure
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1.4, ease: EASE }}
        >
          <motion.div
            style={{ x: printX, y: printY, rotateY: printRotY, rotateX: printRotX }}
            className="rotate-[3deg] rounded-[6px] bg-bone/[0.94] p-2.5 pb-10 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.06)]"
          >
            <Photo image={heroPrint} sizes="300px" className="aspect-[4/5] w-full rounded-[2px]" alt="" />
            <figcaption className="mt-3 flex justify-between px-0.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-ink/60">
              <span>NACOS Jersey Launch</span>
              <span>24KL</span>
            </figcaption>
          </motion.div>
        </motion.figure>
      </motion.div>

      {/* Layer 3 — copy */}
      <motion.div
        className="container-x relative pb-28 md:pb-32"
        style={{ x: textX, y: scrollText, opacity: fadeOut }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="eyebrow mb-7"
        >
          Young24KL Studios · 24KL Visuals
        </motion.p>

        <motion.h1
          variants={stagger(0.11, 0.25)}
          initial="hidden"
          animate="visible"
          className="max-w-[15ch] font-display text-[clamp(2.75rem,8.4vw,8.25rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-bone"
        >
          {HEADLINE.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineRise} className="block">{line}</motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.85 }}
          className="mt-8 flex max-w-xl flex-col gap-8"
        >
          <p className="text-base leading-relaxed text-mist md:text-lg">
            A photography, videography, video editing and motion graphics studio — covering
            sports, campus events, portraits and brand launches with a cinematic eye.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Magnetic>
              <a href="#work" className="btn btn-gold group w-full sm:w-auto">
                View Our Work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <a href="#contact" className="btn btn-ghost w-full sm:w-auto">Book a Session</a>
          </div>
        </motion.div>
      </motion.div>

      {/* Carousel controls */}
      <div className="absolute inset-x-0 bottom-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="container-x flex items-center justify-between gap-6">
          <div className="flex items-center gap-4" role="group" aria-label="Hero photographs">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photograph ${i + 1} of ${heroSlides.length}`}
                aria-current={i === index ? 'true' : undefined}
                className="group flex min-h-11 items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-mist"
              >
                <span className={i === index ? 'text-bone' : 'group-hover:text-bone'}>0{i + 1}</span>
                <span className="relative block h-px w-8 overflow-hidden bg-white/20 sm:w-14">
                  {i === index && (
                    <span
                      key={`${index}-${running}`}
                      className="absolute inset-0 origin-left bg-gold-light"
                      style={
                        running
                          ? { animation: `progress-fill ${SLIDE_MS}ms linear forwards` }
                          : { transform: 'scaleX(1)' }
                      }
                    />
                  )}
                </span>
              </button>
            ))}
            {!reduce && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                className="grid h-11 w-11 place-items-center rounded-full text-mist hover:text-bone"
              >
                {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>

          <a
            href="#work"
            className="hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-mist hover:text-bone md:flex"
          >
            Scroll
            <motion.span
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
