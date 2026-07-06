import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Preloader = ({ visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            <img src={logo} alt="Young24KL Visuals" className="h-20 w-20 md:h-24 md:w-24 rounded-full" />
            <span className="font-display text-3xl md:text-4xl tracking-wide text-white font-bold">
              YOUNG<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C06B] to-[#B48C36]">24KL</span>
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="h-[2px] w-32 bg-gradient-to-r from-[#E5C06B] to-[#B48C36] origin-left"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
