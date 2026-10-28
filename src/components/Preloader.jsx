import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { EASE_FILM } from '../lib/motion';

// Brief brand moment on first load. It never blocks for long (see
// Portfolio.jsx) and lifts like a curtain to reveal the hero.
const Preloader = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        aria-hidden
        initial={{ clipPath: 'inset(0 0 0% 0)' }}
        exit={{ clipPath: 'inset(0 0 100% 0)' }}
        transition={{ duration: 0.9, ease: EASE_FILM }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: EASE_FILM }}
          className="flex flex-col items-center gap-5"
        >
          <img src={logo} alt="" className="h-20 w-20 rounded-full md:h-24 md:w-24" />
          <span className="font-display text-3xl font-bold tracking-wide text-bone md:text-4xl">
            YOUNG<span className="wordmark-gold">24KL</span>
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: EASE_FILM }}
            className="h-px w-32 origin-left bg-gold-light"
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Preloader;
