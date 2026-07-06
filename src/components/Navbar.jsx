import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const NAV_LINKS = [
  { label: 'Vision', href: '#vision' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Team', href: '#team' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/10 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <img src={logo} alt="Young24KL Visuals" className="h-10 w-10 rounded-full" />
            <span className="font-display text-2xl tracking-wide text-white font-bold">
              YOUNG<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C06B] to-[#B48C36]">24KL</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-gray-300 hover:text-[#D4AF37] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-[#E5C06B] to-[#B48C36] text-black px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Book Now
            </a>
          </div>

          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0a0a0a]/98 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="flex items-center gap-3">
                <img src={logo} alt="Young24KL Visuals" className="h-9 w-9 rounded-full" />
                <span className="font-display text-2xl text-white font-bold">
                  YOUNG<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C06B] to-[#B48C36]">24KL</span>
                </span>
              </span>
              <button
                className="text-white p-1"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08 }}
                  className="font-display text-3xl text-white hover:text-[#D4AF37] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.08 }}
                className="mt-4 text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-[#E5C06B] to-[#B48C36] text-black px-8 py-3 rounded-full"
              >
                Book Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
