import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import logo from '../assets/logo.webp';
import { EASE } from '../lib/motion';
import { useModal } from '../lib/useModal';
import { INSTAGRAM_URL } from '../data/content';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Vision', href: '#vision' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export const Wordmark = ({ size = 'md' }) => (
  <span className="flex items-center gap-3">
    <img
      src={logo}
      alt=""
      width="40"
      height="40"
      className={size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'}
    />
    <span className={`flex items-baseline font-display ${size === 'lg' ? 'text-3xl' : 'text-xl'} font-bold tracking-wide`}>
      <span className="wordmark-gold">24KL</span><span className="ml-2 font-sans text-[0.5em] font-semibold tracking-[0.34em] text-bone">VISUALS</span>
    </span>
  </span>
);

// Highlights the section currently in the middle of the viewport.
function useActiveSection(ids) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = ['home', ...NAV_LINKS.map((l) => l.href.slice(1))];

const MobileMenu = ({ onClose, onNavigate }) => {
  const ref = useModal(true, onClose);
  return (
    <motion.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-2xl"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <Wordmark />
        <button
          type="button"
          className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-bone"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="container-x flex flex-1 flex-col justify-center gap-2" aria-label="Mobile">
        {NAV_LINKS.map((link, idx) => (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={(e) => { e.preventDefault(); onNavigate(link.href); }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + idx * 0.05, duration: 0.6, ease: EASE }}
            className="group flex items-baseline justify-between border-b border-white/[0.07] py-4 font-display text-4xl text-bone"
          >
            {link.label}
            <span className="font-sans text-xs tracking-[0.3em] text-dim group-hover:text-gold-pale">
              0{idx + 1}
            </span>
          </motion.a>
        ))}
      </nav>

      <div className="container-x flex flex-col gap-4 pb-8">
        <a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('#contact'); }} className="btn btn-gold w-full">Book a Session</a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
          @24klvisuals <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState(null);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to the work
      </a>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[padding] duration-500"
        style={{ paddingTop: scrolled ? 10 : 18 }}
      >
        <div className="container-x">
          <nav
            aria-label="Primary"
            className={`flex h-14 items-center justify-between rounded-full pl-3 pr-2 transition-all duration-500 md:h-16 md:pl-4 ${
              scrolled
                ? 'border border-white/[0.08] bg-ink/70 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl'
                : 'border border-transparent'
            }`}
          >
            <a href="#home" aria-label="24KL Visuals, back to top" className="rounded-full">
              <Wordmark />
            </a>

            <div className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.slice(0, 4).map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative isolate rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                      isActive ? 'text-bone' : 'text-mist hover:text-bone'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.label}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <a href="#contact" className="btn btn-gold hidden !min-h-10 !px-5 text-[11px] sm:inline-flex">
                Book a Session
              </a>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full text-bone lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Scroll only after the menu has gone and released the scroll lock. */}
      <AnimatePresence
        onExitComplete={() => {
          if (!pendingHref) return;
          const href = pendingHref;
          setPendingHref(null);
          requestAnimationFrame(() => {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            history.replaceState(null, '', href);
          });
        }}
      >
        {menuOpen && (
          <MobileMenu
            onClose={() => setMenuOpen(false)}
            onNavigate={(href) => { setPendingHref(href); setMenuOpen(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
