import React from 'react';
import { motion } from 'motion/react';
import { Shield, BookOpen, Clock, Activity, Cpu, Users, Layers, Calendar, Monitor, MapPin } from 'lucide-react';
import { EVENTS_DATA } from '../data';

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

          {/* Section 3: Events We Organize */}
          <div className="space-y-12">
            <div className="font-mono text-[10px] text-[#A88100] tracking-widest uppercase flex items-center gap-2">
              <Calendar size={12} className="text-[#FFEA00]" />
              <span>03 // EVENTS WE ORGANIZE</span>
            </div>

            {/* Cinematic cards stack with 3D scroll-triggered perspective entry */}
            <div className="space-y-8 [perspective:1200px]">
              {EVENTS_DATA.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 80, scale: 0.93, rotateX: 15, transformOrigin: 'top center' }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  viewport={{ once: false, amount: 0.12 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="relative border border-[#A88100]/20 bg-[#0c0c09]/60 hover:border-[#FFEA00]/60 p-6 md:p-8 rounded-sm transition-colors duration-500 overflow-hidden group flex flex-col gap-6"
                  id={`event-card-${event.id}`}
                >
                  {/* Subtle matrix-like grid overlay on hover */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-0 group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Neon gold radial glow overlay on hover */}
                  <div className="absolute inset-0 bg-radial-glow opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none" />

                  {/* Header: Mode Badge, Time Tag, Event Index */}
                  <div className="flex items-center justify-between font-mono text-[10px] select-none border-b border-[#A88100]/15 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500 font-bold">[0{index + 1}]</span>
                      <div className="flex items-center gap-1.5 text-[#FFC107] font-bold uppercase tracking-widest">
                        <Clock size={11} className="text-[#FFEA00]" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <div className={`px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                      event.mode === 'online'
                        ? 'border border-[#FFEA00]/30 text-[#FFEA00] bg-[#FFEA00]/5'
                        : 'border border-neutral-600/30 text-neutral-300 bg-neutral-900/40'
                    }`}>
                      {event.mode === 'online' ? <Monitor size={10} /> : <MapPin size={10} />}
                      <span>{event.mode}</span>
                    </div>
                  </div>

                  {/* Title and main description */}
                  <div className="space-y-3">
                    <h4 className="text-2xl sm:text-3xl font-black uppercase text-[#FFEA00] tracking-tight font-sans group-hover:text-white transition-colors duration-300">
                      {event.title}
                    </h4>
                    <p className="text-sm text-neutral-300 leading-relaxed font-sans font-normal">
                      {event.description}
                    </p>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#A88100]/15 pt-4 font-mono text-[10px] text-neutral-400">
                    {event.participants && (
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-500 text-[8px] uppercase tracking-wider">METRIC_01 // ACTIVE_ENGAGEMENT</span>
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <Users size={12} className="text-[#FFEA00]" />
                          <span>{event.participants} Participants</span>
                        </div>
                      </div>
                    )}

                    {event.rounds && (
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-500 text-[8px] uppercase tracking-wider">METRIC_02 // SYSTEM_ROUNDS</span>
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <Layers size={12} className="text-[#FFEA00]" />
                          <span>{event.rounds} Competitions</span>
                        </div>
                      </div>
                    )}

                    {event.focus && (
                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <span className="text-neutral-500 text-[8px] uppercase tracking-wider">METRIC_03 // CORE_OBJECTIVE</span>
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <Activity size={12} className="text-[#FFEA00]" />
                          <span>{event.focus}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Round Details */}
                  {event.roundDetails && event.roundDetails.length > 0 && (
                    <div className="border-t border-[#A88100]/15 pt-4 space-y-3 font-mono">
                      <span className="text-neutral-500 text-[8px] uppercase tracking-wider block">PIPELINE_STAGES // COMPILATION_DETAILS</span>
                      <div className="grid grid-cols-1 gap-2">
                        {event.roundDetails.map((detail, rIdx) => (
                          <div key={rIdx} className="p-3 bg-[#0B0B08]/40 border border-[#A88100]/10 hover:border-[#FFEA00]/30 rounded-sm text-xs leading-relaxed text-neutral-300 font-sans transition-all duration-300">
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
