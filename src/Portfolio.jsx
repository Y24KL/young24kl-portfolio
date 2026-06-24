import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Camera, Film, MonitorPlay, ChevronDown, X, ChevronLeft, ChevronRight, Send } from 'lucide-react';

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

const Portfolio = () => {
  const [index, setIndex] = useState(0);
  
  // States for the Interactive Lightbox Gallery
  const [activeProject, setActiveProject] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Form Submission States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
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
    } catch (error) {
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

          <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">
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
            href="https://instagram.com/24klvisuals" // <-- Swap with your actual Instagram handle
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition-colors group"
          >
            {/* Inline SVG Replacement for the Lucide Instagram Icon */}
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
      
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C06B] via-[#D4AF37] to-[#B48C36]">
                YOUNG24KL
              </span>
              <br />
              <span className="text-white">Studios</span>
            </h1>
            <p className="text-lg md:text-2xl font-light tracking-widest uppercase text-[#cfab52] mb-8">
              Creating a visual masterpiece <br className="md:hidden" /> one frame at a time
            </p>
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

      {/* VISION & ABOUT SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-12 items-center backdrop-blur-xl bg-white/[0.02] border border-white/10 p-8 md:p-16 rounded-3xl"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#E5C06B] to-[#B48C36]">
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
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent flex items-end p-8 z-10">
              <span className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">Behind the Scenes</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-24 bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Our Expertise</h2>
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
              { icon: <Camera size={40} />, title: "Photography", desc: "High-resolution, stylized portraiture and commercial photography designed to elevate your visual identity." },
              { icon: <Film size={40} />, title: "Video Editing", desc: "Cinematic cuts, color grading, and narrative pacing that turn raw footage into compelling stories." },
              { icon: <MonitorPlay size={40} />, title: "Motion Graphics", desc: "Dynamic 2D and 3D animations that bring static concepts to life with industry-standard fluid motion." }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                variants={fadeUp}
                className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-colors duration-500 group"
              >
                <div className="text-[#cfab52] mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PREVIOUS WORKS / PORTFOLIO SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div
           variants={fadeUp}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-12 text-white">The Masterpieces</h2>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              variants={fadeUp}
              onClick={() => { setActiveProject(project); setCurrentImgIndex(0); }}
              className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
            >
              <img 
                src={project.images[0]} 
                alt={project.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                <h3 className="text-white text-xl font-bold mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{project.title}</h3>
                <span className="text-[#cfab52] font-semibold tracking-wider uppercase border border-[#cfab52] px-6 py-2 rounded-full hover:bg-[#cfab52] hover:text-black transition-colors">
                  View Gallery
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CEO PROFILE SECTION */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#000000] relative z-10">
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
                 className="absolute inset-0 w-full h-full object-cover z-0" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-8 z-10">
                 <h3 className="text-2xl font-bold text-white">GAMALIEL GODFREY BALANKU</h3>
                 <p className="text-[#D4AF37]">Founder & Creative Director</p>
               </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">The Mind Behind The Lens</h2>
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
     <section className="py-24 bg-[#050505] relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-4 text-white">Let's Create Together</h2>
            <p className="text-gray-400 mb-12 text-lg">Ready to start your next masterpiece? Reach out to us below.</p>
            
            <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" name="name" placeholder="Your Name" required className="w-full bg-[#111] border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white transition-colors" />
                <input type="email" name="email" placeholder="Your Email" required className="w-full bg-[#111] border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white transition-colors" />
              </div>
              <textarea name="message" rows="5" placeholder="Tell us about your project" required className="w-full bg-[#111] border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white transition-colors"></textarea>
              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#E5C06B] to-[#B48C36] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                {isSubmitting ? "Sending..." : "Send Message"} <Send size="{20}"/>
              </button>
            </form>
          </motion.div>
        </div>
      </section>
                <footer className="py-12 border-t border-white/10 text-center text-gray-500 bg-[#000000]">
        <p>© {new Date().getFullYear()} Young24KL Studios. All Rights Reserved.</p>
        <p className="text-sm mt-2">Creating a visual masterpiece one frame at a time.</p>
      </footer>

      
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setActiveProject(null)}
          >
            <button className="absolute top-8 right-8 text-white z-50 hover:text-[#D4AF37] transition-colors" onClick={() => setActiveProject(null)}>
              <X size="{40}"/>
            </button>
            
            <button className="absolute left-4 md:left-12 text-white p-4 bg-white/10 rounded-full hover:bg-white/20 transition z-50" onClick={prevImage}>
              <ChevronLeft size="{30}"/>
            </button>
            
            <img 
              src={activeProject.images[currentImgIndex]} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
            
            <button className="absolute right-4 md:right-12 text-white p-4 bg-white/10 rounded-full hover:bg-white/20 transition z-50" onClick={nextImage}>
              <ChevronRight size="{30}"/>
            </button>
            
            <div className="absolute bottom-8 text-white font-bold tracking-widest bg-black/50 px-6 py-2 rounded-full">
              {currentImgIndex + 1} / {activeProject.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Portfolio;
