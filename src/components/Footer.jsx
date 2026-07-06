import { ArrowUp } from 'lucide-react';

const InstagramIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FOOTER_LINKS = [
  { label: 'Vision', href: '#vision' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

const SERVICES = ['Photography', 'Video Editing', 'Motion Graphics'];

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <a href="#home" className="font-display text-2xl font-bold text-white">
            YOUNG<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C06B] to-[#B48C36]">24KL</span>
          </a>
          <p className="text-gray-500 mt-4 max-w-sm leading-relaxed">
            Creating a visual masterpiece one frame at a time. Cinematic photography,
            video editing, and motion graphics crafted with precision and intent.
          </p>
          <a
            href="https://instagram.com/24klvisuals"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-gray-400 hover:text-[#D4AF37] transition-colors group"
          >
            <InstagramIcon className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-light tracking-wide">@24klvisuals</span>
          </a>
        </div>

        <div>
          <h4 className="text-white font-semibold tracking-wide mb-5 uppercase text-sm">Navigate</h4>
          <ul className="space-y-3">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-gray-500 hover:text-[#cfab52] transition-colors text-sm">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold tracking-wide mb-5 uppercase text-sm">Services</h4>
          <ul className="space-y-3">
            {SERVICES.map((service) => (
              <li key={service} className="text-gray-500 text-sm">{service}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Young24KL Studios. All Rights Reserved.</p>
          <a
            href="#home"
            className="inline-flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
          >
            Back to top <ArrowUp className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
