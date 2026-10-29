import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import FilmStrip from './components/FilmStrip';
import Services from './components/Services';
import Vision from './components/Vision';
import Testimonials from './components/Testimonials';
import Founder from './components/Founder';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/Preloader';

import { featuredProjects } from './data/content';
import { fromCmsDoc, mergeProjects } from './lib/projects';

const PRELOADER_KEY = 'y24kl-intro-seen';

// The intro plays once per browser session and never longer than ~0.9s, so
// returning visitors and deep links get straight to the content.
function useIntro() {
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(PRELOADER_KEY) && !window.location.hash;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setVisible(false);
      try { sessionStorage.setItem(PRELOADER_KEY, '1'); } catch { /* storage unavailable */ }
    }, 900);
    return () => clearTimeout(t);
  }, [visible]);
  return visible;
}

// Live CMS projects (and the site settings flag) from Firestore. The SDK is
// loaded after first paint so it never delays the hero.
function useCmsProjects() {
  const [state, setState] = useState({ status: 'loading', projects: [], featuredImported: false });

  useEffect(() => {
    const unsubscribers = [];
    let cancelled = false;
    const fail = (error) => {
      console.error('Could not load CMS projects:', error);
      if (!cancelled) setState((s) => ({ ...s, status: 'error' }));
    };

    Promise.all([import('./firebase'), import('firebase/firestore')])
      .then(([{ db }, { collection, doc, onSnapshot, orderBy, query }]) => {
        if (cancelled) return;
        let projects = null;
        let settings = null;
        // Only report "ready" once both have arrived, so built-in projects
        // never flash before the CMS copies replace them.
        const publish = () => {
          if (projects && settings) setState({ status: 'ready', projects, featuredImported: settings.featuredImported === true });
        };
        unsubscribers.push(
          onSnapshot(
            query(collection(db, 'projects'), orderBy('createdAt', 'asc')),
            (snapshot) => { projects = snapshot.docs.map((d) => fromCmsDoc(d.id, d.data())); publish(); },
            fail
          ),
          onSnapshot(
            doc(db, 'settings', 'site'),
            (snap) => { settings = snap.data() || {}; publish(); },
            // Older rules without /settings: behave as "not imported".
            () => { settings = {}; publish(); }
          )
        );
      })
      .catch(fail);

    return () => {
      cancelled = true;
      unsubscribers.forEach((u) => u());
    };
  }, []);

  return state;
}

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold-light/80" />;
};

const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#home"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-ink/70 text-bone shadow-lg backdrop-blur-xl transition-colors hover:border-gold-pale hover:text-gold-light"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

const Portfolio = () => {
  const intro = useIntro();
  const cms = useCmsProjects();
  const projects = useMemo(
    () => mergeProjects(featuredProjects, cms.projects, { featuredImported: cms.featuredImported }),
    [cms.projects, cms.featuredImported]
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-ink font-sans text-bone">
      <Preloader visible={intro} />
      <div className="grain-overlay" aria-hidden />
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <Work projects={projects} status={cms.status} />
        <FilmStrip />
        <Services />
        <Vision />
        <Testimonials />
        <Founder />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Portfolio;
