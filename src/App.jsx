import { Suspense, lazy } from 'react';
import { MotionConfig } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Portfolio from './Portfolio';

const Admin = lazy(() => import('./Admin'));

function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return (
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-ink">
            <Loader2 className="h-7 w-7 animate-spin text-gold" aria-label="Loading studio CMS" />
          </div>
        }
      >
        <Admin />
      </Suspense>
    );
  }

  return (
    // Honour the OS "reduce motion" setting for every Framer animation.
    <MotionConfig reducedMotion="user">
      <Portfolio />
    </MotionConfig>
  );
}

export default App;
