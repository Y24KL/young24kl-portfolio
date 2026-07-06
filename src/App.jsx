import { Suspense, lazy } from 'react';
import Portfolio from './Portfolio';

const Admin = lazy(() => import('./Admin'));

function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <Portfolio />
  );
}

export default App;
