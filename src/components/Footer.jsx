import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Wordmark } from './Navbar';
import { inView, reveal, stagger } from '../lib/motion';
import { INSTAGRAM_URL } from '../data/content';

const FOOTER_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Vision', href: '#vision' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

const SERVICES = ['Photography', 'Videography', 'Video Editing', 'Motion Graphics'];

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/[0.06] bg-black" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
    <div className="container-x pt-24 md:pt-32">
      <motion.div variants={stagger(0.1)} {...inView} className="flex flex-col gap-10 border-b border-white/[0.08] pb-20 md:flex-row md:items-end md:justify-between">
        <motion.p
          variants={reveal}
          className="max-w-4xl font-display text-[clamp(2.5rem,6.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-bone"
        >
          Creating a visual masterpiece, <em className="font-medium italic text-gold-light">one frame at a time.</em>
        </motion.p>
        <motion.a variants={reveal} href="#contact" className="btn btn-gold shrink-0 self-start md:self-auto">
          Start a project <ArrowUpRight className="h-4 w-4" />
        </motion.a>
      </motion.div>

      <div className="grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <a href="#home" aria-label="Young24KL Studios, back to top" className="inline-block rounded-full">
            <Wordmark />
          </a>
          <p className="mt-5 max-w-sm leading-relaxed text-dim">
            Cinematic photography, videography, video editing and motion graphics crafted with
            precision and intent.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex min-h-11 items-center gap-2 text-mist transition-colors hover:text-gold-light"
          >
            <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span className="text-sm tracking-wide">@24klvisuals</span>
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.26em] text-bone">Navigate</h2>
          <ul className="space-y-1">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-flex min-h-9 items-center text-sm text-dim transition-colors hover:text-gold-light">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.26em] text-bone">Services</h2>
          <ul className="space-y-1">
            {SERVICES.map((service) => (
              <li key={service} className="flex min-h-9 items-center text-sm text-dim">{service}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-white/[0.06]">
      <div className="container-x flex flex-col-reverse items-center justify-between gap-4 py-6 text-xs tracking-wide text-dim md:flex-row">
        <p>© {new Date().getFullYear()} Young24KL Studios. All rights reserved.</p>
        <a href="#home" className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-gold-light">
          Back to top <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </div>

    <p aria-hidden className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[22vw] font-bold leading-[0.75] tracking-[-0.04em] text-white/[0.025]">
      24KL
    </p>
  </footer>
);

export default Footer;
