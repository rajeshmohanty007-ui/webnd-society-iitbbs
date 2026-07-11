import React from 'react';
import { motion } from 'motion/react';
import { Shield, BookOpen, Clock, Activity, Cpu } from 'lucide-react';
import { TIMELINE_DATA } from '../data';

export default function AboutSection() {
  return (
    <section className="relative min-h-screen w-full select-none bg-transparent py-24">
      {/* Container split layout */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 px-6 md:px-12 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: Sticky frame for architectural topo wireframe (transparent background to let GlobalCanvas shine!) */}
        <div className="lg:col-span-5 h-[300px] lg:h-[calc(100vh-180px)] lg:sticky lg:top-24 flex flex-col justify-between border border-[#A88100]/20 p-6 md:p-8 bg-neutral-900/10 rounded-sm">
          <div>
            <div className="font-mono text-[10px] text-[#A88100] flex items-center gap-2 tracking-widest mb-3 animate-pulse">
              <Cpu size={12} className="text-[#FFEA00]" />
              <span>SEC_04 // TOPO_GRID_ENGINE</span>
            </div>
            
            <h3 className="text-3xl font-black uppercase text-[#FFEA00] tracking-tighter leading-tight font-sans">
              STRUCTURAL DESIGN
            </h3>
            <p className="font-mono text-[11px] text-neutral-400 mt-2 max-w-xs">
              Muted Ochre (<span className="text-[#A88100]">#A88100</span>) topology model representing structural digitizations of institutional concepts.
            </p>
          </div>

          {/* This transparent region lets the 3D topographical canvas shine through! */}
          <div className="flex-1 min-h-[140px]" />

          <div className="font-mono text-[9px] text-neutral-500 flex justify-between items-end border-t border-[#A88100]/15 pt-4">
            <span>MODEL: MATRIX_TERRAIN_3D</span>
            <span className="text-[#A88100] animate-pulse">● CALIBRATED</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrollable Narrative, Manifesto & Timeline */}
        <div className="lg:col-span-7 space-y-24">
          
          {/* Section 1: Manifesto Header & Narrative */}
          <div className="space-y-6">
            <div className="font-mono text-[10px] text-[#A88100] tracking-widest uppercase flex items-center gap-2">
              <BookOpen size={12} className="text-[#FFEA00]" />
              <span>01 // THE MANIFESTO</span>
            </div>

            {/* Kinetic Typography Reveal using clip-path polygon masks! */}
            <div className="space-y-4">
              <motion.h3
                initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                whileInView={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl font-black uppercase text-[#FFEA00] tracking-tighter leading-none font-sans"
              >
                BUILDING DIGITAL
              </motion.h3>
              <motion.h3
                initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                whileInView={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1.2, delay: 0.15, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl font-black uppercase text-white tracking-tighter leading-none font-sans"
              >
                CANVASES AT IIT BBS.
              </motion.h3>
            </div>

            <p className="font-sans text-neutral-300 text-sm leading-relaxed pt-2">
              We believe a website is not a flat directory of links; it is an interactive living organism. 
              Our design philosophy centers on geometric structural logic, clean monochromatic color blocks, 
              and highly performant rendering cycles. 
              By stripping away unsolicited telemetry and visual slop, we let pure typographical hierarchies 
              and functional animations drive the message.
            </p>
          </div>

          {/* Section 2: Core Values Grid */}
          <div className="space-y-8">
            <div className="font-mono text-[10px] text-[#A88100] tracking-widest uppercase flex items-center gap-2">
              <Activity size={12} className="text-[#FFEA00]" />
              <span>02 // STRUCTURAL CORE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono">
              <div className="border border-[#A88100]/20 p-5 bg-neutral-900/10 rounded-sm hover:border-[#FFEA00]/40 transition-colors">
                <span className="text-[10px] text-[#FFEA00] font-bold block mb-2">[01] INTENT_FIRST_DEVELOPMENT</span>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                  Every feature has a precise programmatic purpose. We execute only what is required to satisfy human utility and clear system constraints.
                </p>
              </div>

              <div className="border border-[#A88100]/20 p-5 bg-neutral-900/10 rounded-sm hover:border-[#FFEA00]/40 transition-colors">
                <span className="text-[10px] text-[#FFEA00] font-bold block mb-2">[02] KINETIC_CONTRAST</span>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                  Alternating animations, vertical depth tracks, and responsive glowing interfaces are matched directly to user interactions.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Historical Timeline */}
          <div className="space-y-12">
            <div className="font-mono text-[10px] text-[#A88100] tracking-widest uppercase flex items-center gap-2">
              <Clock size={12} className="text-[#FFEA00]" />
              <span>03 // CHRONOLOGY TRACE</span>
            </div>

            {/* Vertical timeline trace with nodes */}
            <div className="relative border-l border-[#A88100]/30 pl-6 md:pl-10 ml-3 space-y-12">
              {TIMELINE_DATA.map((event, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={event.year}
                  className="relative group"
                  id={`timeline-event-${event.year}`}
                >
                  {/* Timeline Junction Node dot */}
                  <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full border border-[#FFEA00] bg-[#0B0B08] flex items-center justify-center group-hover:bg-[#FFEA00] transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFEA00] group-hover:bg-[#0B0B08] transition-colors" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold font-mono text-[#FFEA00] tracking-wider">
                        {event.year}
                      </span>
                      <div className="h-[1px] w-8 bg-[#A88100]/30" />
                      <span className="text-xs font-bold font-mono text-[#FFC107] uppercase tracking-widest">
                        {event.title}
                      </span>
                    </div>

                    <p className="text-sm font-sans font-bold text-white uppercase tracking-tight">
                      {event.description}
                    </p>

                    <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                      {event.details}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
