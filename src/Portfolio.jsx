import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Film, MonitorPlay, ChevronDown, X, ChevronLeft, ChevronRight, Send, ArrowUp, Quote, Star } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Counter from './components/Counter';

import hero1 from './assets/IMG_9204.JPG';
import hero2 from './assets/IMG_3599.JPG';
import hero3 from './assets/IMG_9217.JPG';
import p1_a from './assets/IMG_9210.JPG';
import p1_b from './assets/IMG_9204.JPG';
import p1_c from './assets/IMG_9185.JPG';
import p2_a from './assets/IMG_3904.JPG';
import p2_b from './assets/IMG_3903.JPG';
import p2_c from './assets/IMG_4349.JPG';
import p2_d from './assets/IMG_8716.JPG';
import p2_e from './assets/IMG_8719.JPG';
import p2_f from './assets/IMG_8526.JPG';
import p2_g from './assets/IMG_8577.JPG';
import p2_h from './assets/IMG_8648.JPG';
import p2_i from './assets/IMG_8654.JPG';
import btsImage from './assets/IMG_9252.JPG';
import ceoImage from './assets/ceo-pic.jpg';

const heroImages = [hero1, hero2, hero3];

const stats = [
  { value: 3, suffix: '+', label: 'Years Behind the Lens' },
  { value: 50, suffix: '+', label: 'Events Covered' },
  { value: 1000, suffix: '+', label: 'Photos Delivered' },
  { value: 20, suffix: 'K+', label: 'Instagram Community' },
];

const testimonials = [
  {
    quote: "Young24KL turned our HOD games into something that looked straight out of a sports network broadcast. Every frame had energy.",
    name: "Event Committee",
    role: "CSC HOD Games",
  },
  {
    quote: "They didn't just document Shodeinde Hall Week, they made it feel cinematic. The turnaround time was just as impressive as the quality.",
    name: "Hall Committee",
    role: "Shodeinde Hall Week",
  },
  {
    quote: "The jersey launch photos gave our brand an identity. Sharp, stylish, and exactly the premium look we were going for.",
    name: "NACOS Executives",
    role: "NACOS Jersey Launch",
  },
];

const Portfolio = () => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // States for the Interactive Lightbox Gallery
  const [activeProject, setActiveProject] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Form Submission States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const projects = [
    { id: 1, title: "CSC HOD GAMES", images: [p1_a, p1_b, p1_c] },
    { id: 2, title: "SHODEINDE HALL WEEK", images: [p2_a, p2_b, p2_c] },
    { id: 3, title: "NACOS JERSEY LAUNCH", images: [p2_d, p2_e, p2_f, p2_g, p2_h, p2_i] },
  ];

  // Gallery Navigation Functions
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % activeProject.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + activeProject.images.length) % activeProject.images.length);
  };

  // Background Form Submission Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xykaaqnn", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
      } else {
        alert("Oops! There was a problem submitting your form. Please try again.");
      }
    } catch {
      alert("Oops! There was a problem connecting to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for staggered reveals
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  // --- INTERACTIVE THANK YOU SCREEN VIEW ---
  if (isSubmitted) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-gray-200 font-sans flex flex-col items-center justify-center relative overflow-hidden px-4 selection:bg-[#cfab52] selection:text-black">

        {/* Ambient Cinematic Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl text-center backdrop-blur-xl bg-white/[0.02] border border-white/10 p-8 md:p-14 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-20 h-20 bg-gradient-to-r from-[#E5C06B] to-[#B48C36] rounded-full flex items-center justify-center text-black mx-auto mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </motion.div>

          <h2 className="font-display text-3xl font-extrabold text-white mb-6 tracking-tight">
            Booking Confirmed!
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Thank you for booking us our HR will get back to you in the next 24hours
          </p>

          <button
            onClick={() => setIsSubmitted(false)}
            className="border border-[#cfab52] text-[#cfab52] hover:bg-[#cfab52] hover:text-black font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg"
          >
            Back to Portfolio
          </button>
        </motion.div>

        {/* Custom Instagram Redirection Footer */}
        <footer className="absolute bottom-8 text-center z-10 text-sm">
          <a
            href="https://instagram.com/24klvisuals"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition-colors group"
          >
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
              className="group-hover:scale-110 transition-transform text-gray-400 group-hover:text-[#D4AF37]"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span className="font-light tracking-wide">Connect with us on Instagram</span>
          </a>
        </footer>
      </div>
    );
  }

  // --- MAIN PORTFOLIO INTERFACE VIEW ---
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-gray-200 font-sans overflow-x-hidden selection:bg-[#cfab52] selection:text-black">
      <Preloader visible={loading} />
      <div className="grain-overlay" />
      <Navbar />

      {/* HERO SECTION */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={heroImages[index]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </AnimatePresence>

        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0a0a0a]" />

        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 mb-6 text-xs md:text-sm uppercase tracking-[0.3em] text-[#cfab52]">
              <span className="h-px w-8 bg-[#cfab52]/60" />
              Photography · Videography · Motion
              <span className="h-px w-8 bg-[#cfab52]/60" />
            </div>
            <h1 className="font-display text-5xl md:text-8xl font-extrabold tracking-tighter mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C06B] via-[#D4AF37] to-[#B48C36]">
                YOUNG24KL
              </span>
              <br />
              <span className="text-white">Studios</span>
            </h1>
            <p className="text-lg md:text-2xl font-light tracking-widest uppercase text-[#cfab52] mb-10">
              Creating a visual masterpiece <br className="md:hidden" /> one frame at a time
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#work"
                className="w-full sm:w-auto text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-[#E5C06B] to-[#B48C36] text-black px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity"
              >
                View Our Work
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto text-sm font-semibold uppercase tracking-wider border border-[#cfab52]/60 text-[#cfab52] px-8 py-3.5 rounded-full hover:bg-[#cfab52] hover:text-black transition-all duration-300"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 animate-bounce text-[#cfab52]"
          >
            <ChevronDown size={32} strokeWidth={1.5} />
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative z-10 border-y border-white/10 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="text-gray-500 text-xs md:text-sm uppercase tracking-widest mt-3">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VISION & ABOUT SECTION */}
      <section id="vision" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-12 items-center backdrop-blur-xl bg-white/[0.02] border border-white/10 p-8 md:p-16 rounded-3xl"
        >
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#E5C06B] to-[#B48C36]">
              The Vision
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] mb-8"></div>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              At Young24KL Studios, we don't just capture moments; we architect cinematic experiences. Born from a passion for visual storytelling, our studio merges high-end technology with raw creative intuition.
            </p>
          </div>
          <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden group">
            <img
              src={btsImage}
              alt="Behind the Scenes"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent flex items-end p-8 z-10">
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">Behind the Scenes</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4 text-white">Our Expertise</h2>
            <p className="text-[#cfab52]">Precision. Aesthetics. Motion. Excellence.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: <Camera size={40} />, num: "01", title: "Photography", desc: "High-resolution, stylized portraiture and commercial photography designed to elevate your visual identity." },
              { icon: <Film size={40} />, num: "02", title: "Video Editing", desc: "Cinematic cuts, color grading, and narrative pacing that turn raw footage into compelling stories." },
              { icon: <MonitorPlay size={40} />, num: "03", title: "Motion Graphics", desc: "Dynamic 2D and 3D animations that bring static concepts to life with industry-standard fluid motion." }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="relative bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-colors duration-500 group overflow-hidden"
              >
                <span className="font-display absolute -top-4 -right-2 text-8xl font-bold text-white/[0.03] select-none pointer-events-none">
                  {service.num}
                </span>
                <div className="relative text-[#cfab52] mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                  {service.icon}
                </div>
                <h3 className="relative font-display text-2xl font-bold mb-4 text-white">{service.title}</h3>
                <p className="relative text-gray-400 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MASTERPIECES PORTFOLIO GALLERY SECTION */}
      <section id="work" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl font-bold mb-4 text-white">Our Masterpieces</h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          <p className="text-[#cfab52] tracking-wider uppercase text-sm">A curation of captured history, sports, and live moments.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onClick={() => {
                setActiveProject(project);
                setCurrentImgIndex(0);
              }}
              className="group relative h-[420px] rounded-2xl overflow-hidden border border-white/5 cursor-pointer bg-[#0f0f0f] shadow-lg"
            >
              {/* Uses the first image of the collection as the grid thumbnail cover */}
              <img
                src={project.images[0]}
                alt={project.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Premium Dark Gradient Blur */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-95" />

              {/* Interactive Info Block */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-2">
                  Collection — {project.images.length} Photos
                </p>
                <h3 className="font-display text-2xl font-extrabold text-white mb-5 tracking-tight group-hover:text-[#cfab52] transition-colors">
                  {project.title}
                </h3>
                <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#cfab52] border border-[#cfab52]/40 px-5 py-2.5 rounded-full backdrop-blur-md group-hover:bg-[#cfab52] group-hover:text-black transition-all duration-300 w-fit">
                  View Gallery
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setActiveProject(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white z-50 hover:text-[#D4AF37] transition-colors bg-black/40 p-2 rounded-full md:bg-transparent md:p-0"
              onClick={() => setActiveProject(null)}
            >
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            {/* Left Navigation Arrow */}
            <button
              className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 text-white p-3 md:p-4 bg-white/10 rounded-full hover:bg-white/20 transition z-50"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Image Box */}
            <img
              src={activeProject.images[currentImgIndex]}
              className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Right Navigation Arrow */}
            <button
              className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12 text-white p-3 md:p-4 bg-white/10 rounded-full hover:bg-white/20 transition z-50"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-6 md:bottom-8 text-white font-bold tracking-widest bg-black/50 px-6 py-2 rounded-full text-sm md:text-base">
              {currentImgIndex + 1} / {activeProject.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-[#050505] relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4 text-white">What Clients Say</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl hover:border-[#D4AF37]/30 transition-colors duration-500"
              >
                <Quote className="text-[#D4AF37]/40 w-8 h-8 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-gray-400 leading-relaxed mb-6 italic">"{t.quote}"</p>
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-[#cfab52] text-sm">{t.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CEO PROFILE SECTION */}
      <section id="team" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#000000] relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="w-full md:w-1/3 aspect-[4/5] bg-zinc-800 rounded-3xl overflow-hidden relative border border-white/10 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
               <img
                 src={ceoImage}
                 alt="Gamaliel Godfrey Balanku"
                 loading="lazy"
                 className="absolute inset-0 w-full h-full object-cover z-0"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-8 z-10">
                 <h3 className="font-display text-2xl font-bold text-white">GAMALIEL GODFREY BALANKU</h3>
                 <p className="text-[#D4AF37]">Founder & Creative Director</p>
               </div>
            </div>

            <div className="w-full md:w-2/3">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-white">The Mind Behind The Lens</h2>
              <div className="w-20 h-1 bg-[#D4AF37] mb-8"></div>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>
                With years of experience pushing the boundaries of digital media, our CEO established Young24KL Studios to bridge the gap between imagination and reality. Known for a meticulous eye for detail and an uncompromising standard of excellence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
     <section id="contact" className="py-24 bg-[#050505] relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-display text-4xl font-bold mb-4 text-white">Let's Create Together</h2>
            <p className="text-gray-400 mb-12 text-lg">Ready to start your next masterpiece? Reach out to us below.</p>

            <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" name="name" placeholder="Your Name" required className="w-full bg-[#111] border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white transition-colors" />
                <input type="email" name="email" placeholder="Your Email" required className="w-full bg-[#111] border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white transition-colors" />
              </div>
              <textarea name="message" rows="5" placeholder="Tell us about your project" required className="w-full bg-[#111] border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white transition-colors"></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#E5C06B] to-[#B48C36] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="whitespace-nowrap">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <Send className="w-5 h-5 shrink-0" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.a
            href="#home"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#E5C06B] to-[#B48C36] text-black p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.a>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Portfolio;
