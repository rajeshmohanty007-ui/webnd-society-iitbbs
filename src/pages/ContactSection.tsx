import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MapPin, Send, Github, Linkedin, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/useStore';

export default function ContactSection() {
  const triggerPulse = useStore((state) => state.triggerTypingPulse);

  // Local state for interactive logs and status
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [keystrokes, setKeystrokes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setKeystrokes((k) => k + 1);

    // Call the global Zustand action to pulse the background canvas!
    triggerPulse();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate high-tech digital transmission sequence
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 2000);
  };

  return (
    <section className="relative min-h-screen w-full select-none bg-transparent py-28 px-6 md:px-12 flex items-center justify-center">
      {/* Visual background coordinate grids */}
      <div className="absolute inset-0 bg-radial-glow opacity-10 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">

        {/* LEFT COLUMN: HIGH IMPACT TYPOGRAPHY & HANDLES */}
        <div className="space-y-10">
          <div>
            <div className="font-mono text-[10px] text-[#A88100] flex items-center gap-2 tracking-widest mb-2 animate-pulse">
              <Terminal size={12} className="text-[#FFEA00]" />
              <span>SEC_05 // TRANSMISSION_NODE</span>
            </div>

            <h2 className="text-5xl sm:text-7xl font-black uppercase text-[#FFEA00] tracking-tighter leading-none font-sans">
              CONNECT // <br />
              INTERFACE
            </h2>
            <p className="font-mono text-xs text-neutral-400 mt-4 max-w-sm leading-relaxed">
              Initiate a high-frequency link to our operative core. Type inside the console inputs on the right to sync the live background particle grids.
            </p>
          </div>

          {/* Contact Details & Metadata handles */}
          <div className="font-mono space-y-6 text-xs text-neutral-400">
            <div className="flex items-start gap-4">
              <div className="p-2 border border-[#A88100]/20 bg-neutral-900/10 rounded-sm text-[#FFEA00]">
                <MapPin size={15} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[#A88100] uppercase tracking-widest text-[9px] block font-bold">PHYSICAL_GRID_COORDINATES</span>
                <p className="text-white uppercase">IIT BHUBANESWAR CAMPUS</p>
                <p className="text-[10px] text-neutral-500">Argul, Jatni, Odisha - 752050</p>
                <p className="text-[9px] text-[#FFC107]">LOC: 20.1484° N, 85.6712° E</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 border border-[#A88100]/20 bg-neutral-900/10 rounded-sm text-[#FFEA00]">
                <Mail size={15} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[#A88100] uppercase tracking-widest text-[9px] block font-bold">DIRECT_SECURE_LINK</span>
                <p className="text-white hover:text-[#FFEA00] transition-colors">
                  <a href="mailto:secyweb.sg@iitbbs.ac.in">secyweb.sg@iitbbs.ac.in</a>
                </p>
                <p className="text-[10px] text-neutral-500">Response Latency: &lt; 24h</p>
              </div>
            </div>
          </div>

          {/* Social Anchor Links */}
          <div className="flex items-center gap-4 border-t border-[#A88100]/15 pt-6 font-mono text-[10px]">
            <span className="text-[#A88100] uppercase tracking-wider font-bold">EXTERNAL_BRIDGES:</span>
            <div className="flex gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-[#A88100]/20 hover:border-[#FFEA00] bg-neutral-900/15 py-1 px-3 text-neutral-400 hover:text-[#FFEA00] transition-all rounded-sm"
              >
                <Github size={11} />
                <span>GITHUB</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-[#A88100]/20 hover:border-[#FFEA00] bg-neutral-900/15 py-1 px-3 text-neutral-400 hover:text-[#FFEA00] transition-all rounded-sm"
              >
                <Linkedin size={11} />
                <span>LINKEDIN</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE FORM WITH GLOW FIELDS & TYPING FEEDBACK LOOP */}
        <div className="relative">
          <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-900/10 border border-[#A88100]/20 p-6 md:p-8 rounded-sm">

            {/* Field 1: OPERATOR_NAME */}
            <div className="space-y-1">
              <label className="font-mono text-[9px] text-[#A88100] font-bold tracking-widest uppercase">
                [01] OPERATOR_IDENTITY
              </label>
              {/* Custom Glowing Line Wrapper - expands neon yellow from center on focus! */}
              <div className="relative w-full before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-[#A88100]/30 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:-translate-x-1/2 after:h-[2px] after:bg-[#FFEA00] after:transition-all after:duration-300 focus-within:after:w-full">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="ENTER NAME / CALLSIGN"
                  className="w-full bg-transparent py-3.5 px-1 font-mono text-xs text-white placeholder-neutral-700 focus:outline-none focus:placeholder-neutral-500 uppercase tracking-widest"
                />
              </div>
            </div>

            {/* Field 2: OPERATOR_EMAIL */}
            <div className="space-y-1">
              <label className="font-mono text-[9px] text-[#A88100] font-bold tracking-widest uppercase">
                [02] ROUTING_MAILBOX
              </label>
              <div className="relative w-full before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-[#A88100]/30 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:-translate-x-1/2 after:h-[2px] after:bg-[#FFEA00] after:transition-all after:duration-300 focus-within:after:w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="ENTER SECURE EMAIL"
                  className="w-full bg-transparent py-3.5 px-1 font-mono text-xs text-white placeholder-neutral-700 focus:outline-none focus:placeholder-neutral-500 tracking-widest"
                />
              </div>
            </div>

            {/* Field 3: MESSAGE */}
            <div className="space-y-1">
              <label className="font-mono text-[9px] text-[#A88100] font-bold tracking-widest uppercase">
                [03] TRANSMISSION_BODY
              </label>
              <div className="relative w-full before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-[#A88100]/30 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:-translate-x-1/2 after:h-[2px] after:bg-[#FFEA00] after:transition-all after:duration-300 focus-within:after:w-full">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="WRITE TRANSMISSION LOGS..."
                  className="w-full bg-transparent py-3.5 px-1 font-mono text-xs text-white placeholder-neutral-700 focus:outline-none focus:placeholder-neutral-500 tracking-widest resize-none uppercase"
                />
              </div>
            </div>

            {/* Simulated Debug Console logs */}
            <div className="font-mono text-[8px] text-neutral-500 bg-black/40 border border-[#A88100]/10 p-3 space-y-1 uppercase rounded-sm">
              <p className="text-[#FFC107]">// INPUT_TELEMETRY_MONITOR</p>
              <p>KEYSTROKES_PULSED: {keystrokes}</p>
              <p>PACKET_SIZE: {Math.max(0, formData.name.length + formData.email.length + formData.message.length) * 8} BITS</p>
              <p>GRID_SYNC_STATE: {keystrokes > 0 ? 'PULSING_REACTIVE' : 'IDLE_STATIC'}</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative border border-[#FFEA00] bg-[#FFEA00]/5 hover:bg-[#FFEA00] text-[#FFEA00] hover:text-black py-4 text-xs font-mono tracking-widest font-bold uppercase transition-colors duration-300 flex items-center justify-center gap-3 cursor-pointer rounded-sm"
              id="submit-transmission-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFEA00] hover:bg-black animate-ping" />
                  <span>COMPILING_TRANSMISSION...</span>
                </>
              ) : (
                <>
                  <span>EXECUTE_TRANSMISSION</span>
                  <Send size={12} />
                </>
              )}
            </button>
          </form>

          {/* Success Dialog overlay */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-[#0B0B08]/95 border border-[#FFEA00] flex flex-col items-center justify-center text-center p-6 rounded-sm z-20 font-mono"
              >
                <CheckCircle2 size={44} className="text-[#FFEA00] animate-bounce mb-4" />
                <h3 className="text-[#FFEA00] text-lg font-black uppercase tracking-widest">
                  TRANSMISSION SUCCESSFUL
                </h3>
                <p className="text-neutral-400 text-xs max-w-xs mt-3 leading-relaxed">
                  Your secure communications pack has been compiled, encrypted, and dispatched to our coordinating lead.
                </p>
                <p className="text-[#A88100] text-[9px] mt-6">
                  ID: TX_ACK_OK_{Math.floor(Math.random() * 900000 + 100000)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
