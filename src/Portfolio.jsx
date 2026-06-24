import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Camera, Film, MonitorPlay, ChevronDown, X, ChevronLeft, ChevronRight, Send } from 'lucide-react';

// Ensure these files exist in src/assets and names match EXACTLY
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
  const [activeProject, setActiveProject] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const projects = [
    { id: 1, title: "CSC HOD GAMES", images: [p1_a, p1_b, p1_c] },
    { id: 2, title: "SHODEINDE HALL WEEK", images: [p2_a, p2_b, p2_c] },
    { id: 3, title: "NACOS JERSEY LAUNCH", images: [p2_d, p2_e, p2_f, p2_g, p2_h, p2_i] },
  ];

  // ... (Keep handleFormSubmit, nextImage, and prevImage functions as they were)
  const nextImage = (e) => { e.stopPropagation(); setCurrentImgIndex((prev) => (prev + 1) % activeProject.images.length); };
  const prevImage = (e) => { e.stopPropagation(); setCurrentImgIndex((prev) => (prev - 1 + activeProject.images.length) % activeProject.images.length); };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* NAVIGATION - Text-based to avoid file path errors */}
      <nav className="absolute top-0 w-full p-6 md:px-12 z-50 flex items-center justify-center md:justify-start">
        <h1 className="text-2xl font-black tracking-tighter text-white">
          YOUNG24KL <span className="text-[#D4AF37]">Studios</span>
        </h1>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={heroImages[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6">
            Creating a visual <br /> masterpiece.
          </h1>
          <p className="text-[#D4AF37] font-medium tracking-widest uppercase">One frame at a time</p>
        </div>
      </section>

      {/* ABOUT & SERVICES - Updated to dark theme */}
      <section className="py-24 bg-black px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-4xl md:text-6xl font-bold mb-8">The Vision</h2>
                <p className="text-gray-400 text-lg leading-relaxed">At Young24KL Studios, we don't just capture moments; we architect cinematic experiences.</p>
            </div>
            <img src={btsImage} className="rounded-2xl shadow-2xl shadow-[#D4AF37]/10" alt="BTS" />
        </div>
      </section>

      {/* CONTACT SECTION - Dark Theme */}
      <section className="py-24 bg-[#111] border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Let's Create Together</h2>
            <form className="space-y-4">
                <input type="text" placeholder="Name" className="w-full bg-black border border-white/10 p-4 rounded focus:border-[#D4AF37] outline-none" />
                <textarea placeholder="Message" className="w-full bg-black border border-white/10 p-4 rounded h-32 focus:border-[#D4AF37] outline-none"></textarea>
                <button className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded hover:bg-[#b89630] transition-colors">Send Message</button>
            </form>
        </div>
      </section>

      {/* LIGHTBOX (Black overlay maintained) */}
      <AnimatePresence>
        {activeProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setActiveProject(null)}>
            <button className="absolute top-8 right-8 text-white" onClick={() => setActiveProject(null)}><X size={40} /></button>
            <img src={activeProject.images[currentImgIndex]} className="max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
