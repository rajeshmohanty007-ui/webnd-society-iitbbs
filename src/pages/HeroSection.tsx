import React, { useState, useEffect } from 'react';
import { motion, useTransform, useScroll } from 'motion/react';
import { ChevronDown, Sparkles, Terminal as TerminalIcon } from 'lucide-react';

interface HeroSectionProps {
  scrollProgress: number;
  scrollToSection: (index: number) => void;
}

export default function HeroSection({ scrollProgress, scrollToSection }: HeroSectionProps) {
  // Let's create beautiful horizontal parallax offsets for kinetic typography based on scrollProgress
  // scrollProgress goes from 0 to 1
  const [isMobile, setIsMobile] = useState(false);
  const line1X = isMobile ? 0 : (0.5 - scrollProgress) * -150; // slides right-to-left
  const line2X = isMobile ? 40 : (0.5 - scrollProgress) * 150;  // slides left-to-right
  const line3X = isMobile ? 0 : (0.5 - scrollProgress) * -100; // slides right-to-left

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col justify-between items-center px-6 py-24 md:px-12 select-none overflow-hidden">
      {/* Top Left Labeling */}
      <div className='w-full flex absolute top-28 px-6 flex-col md:flex-row md:justify-between'>
        <div className="font-mono text-[10px] text-[#A88100] flex items-center gap-2 tracking-widest animate-pulse">
          <TerminalIcon size={12} className="text-[#FFEA00]" />
          <span>SEC_01 // COGNITIVE_GATEWAY</span>
        </div>

        {/* Top Right Coordinate / Server Status Info */}
        <div className="font-mono text-[9px] text-neutral-500 space-y-0.5">
          <p>SYSTEM REVISION: R6_2026</p>
          <p className="text-[#FFC107]">FPS: 60 // GPU_COMPILER_ONLINE</p>
        </div>
      </div>

      {/* Center Hero Kinetic Typography */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-5xl text-center space-y-4 md:space-y-6 z-10 mt-10">
        <div className="overflow-hidden w-full">
          <motion.h1
            style={{ x: line1X }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-[#FFEA00] font-sans"
            id="hero-line-1"
          >
            IMAGINE //
          </motion.h1>
        </div>

        <div className="overflow-hidden w-full">
          <motion.h1
            style={{ x: line2X }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-transparent stroke-text font-sans"
            id="hero-line-2"
          >
            CODE //
          </motion.h1>
        </div>

        <div className="overflow-hidden w-full">
          <motion.h1
            style={{ x: line3X }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-[#FFC107] font-sans"
            id="hero-line-3"
          >
            TRANSFORM
          </motion.h1>
        </div>

        {/* Short high-concept subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-mono text-[11px] sm:text-xs text-neutral-400 max-w-md tracking-wider leading-relaxed pt-4 text-center mx-auto"
        >
          We are the digital architects of <span className="text-[#FFEA00] font-semibold">IIT Bhubaneswar</span>.
          Bridging system-level computing and fine visual aesthetics through creative coding.
        </motion.p>
      </div>

      {/* Bottom Status & Scroll Indicator */}
      <div className="flex flex-col items-center gap-4 z-10 pb-4">
        {/* Horizontal Technical Ribbon */}
        <div className="hidden md:flex items-center gap-8 text-[10px] text-neutral-500 font-mono tracking-widest border-t border-b border-[#A88100]/20 py-2 px-6">
          <span className="flex items-center gap-1.5"><Sparkles size={11} className="text-[#FFEA00]" /> CREATIVE CODING</span>
          <span className="text-neutral-700">|</span>
          <span>HUMAN INTERACTION</span>
          <span className="text-neutral-700">|</span>
          <span>COMPILER GRAPHICS</span>
        </div>

        {/* Scroll path indicator SVG */}
        {!isMobile && <button
          onClick={() => scrollToSection(1)}
          className="flex flex-col items-center text-xs font-mono text-neutral-400 hover:text-[#FFEA00] transition-colors gap-2 group cursor-pointer"
          id="scroll-indicator"
        >
          <span className="tracking-widest text-[9px] uppercase">INITIATE SCROLL ENGINE</span>
          <div className="w-6 h-10 border border-[#A88100] rounded-full p-1 flex justify-center relative overflow-hidden">
            <motion.div
              animate={{
                y: [0, 16, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1 h-2 bg-[#FFEA00] rounded-full"
            />
          </div>
        </button>}
      </div>

      {/* Custom Stroke Styles injected via style tag safely for the stroke outline text */}
      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px #FFEA00;
          color: transparent;
        }
        @media (min-width: 768px) {
          .stroke-text {
            -webkit-text-stroke: 2px #FFEA00;
          }
        }
      `}</style>
    </section>
  );
}
