import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Flame, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: number;
  setActiveSection: React.Dispatch<React.SetStateAction<number>>;
  scrollToSection: (index: number) => void;
}

export default function Header({ activeSection, setActiveSection, scrollToSection }: HeaderProps) {
  const [time, setTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'TERMINAL', index: 0 },
    { label: 'ROSTER', index: 1 },
    { label: 'ARCHIVE', index: 2 },
    { label: 'MANIFESTO', index: 3 },
    { label: 'TRANSMIT', index: 4 },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0B0B08]/80 backdrop-blur-md border-b border-[#A88100]/20 px-6 py-4 md:px-12 flex justify-between items-center font-mono">
      {/* Brand Identity */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection(0)}>
        <div className="w-8 h-8 rounded-sm bg-[#FFEA00] flex items-center justify-center text-black font-black text-sm relative overflow-hidden group">
          <span className="relative z-10">W</span>
          <div className="absolute inset-0 bg-[#FFC107] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </div>
        <div>
          <h1 className="text-sm font-bold uppercase tracking-widest text-[#FFEA00]">IIT BHUBANESWAR</h1>
          <p className="text-[9px] text-[#A88100]/80 tracking-widest">WEB & DESIGN SOCIETY</p>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-xs">
        {navItems.map((item) => {
          const isActive = activeSection === item.index;
          return (
            <button
              key={item.index}
              onClick={() => scrollToSection(item.index)}
              className={`relative py-1 tracking-widest transition-colors duration-300 cursor-pointer ${isActive ? 'text-[#FFEA00] font-bold' : 'text-neutral-400 hover:text-white'
                }`}
            >
              {item.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FFEA00] animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Clock & Metadata */}
      <div className="hidden lg:flex flex-col items-end text-[10px] text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFEA00] animate-pulse" />
          <span className="text-[#FFEA00] uppercase tracking-wider">SYSTEM ACTIVE</span>
        </div>
        <span className="font-mono mt-1 text-[11px] text-[#A88100] font-semibold">{time}</span>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-neutral-400 hover:text-[#FFEA00] transition-colors p-1"
        id="mobile-nav-toggle"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0B0B08] border-b border-[#A88100]/30 py-6 px-8 flex flex-col gap-4 md:hidden z-40 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.index}
              onClick={() => {
                scrollToSection(item.index);
                setMobileMenuOpen(false);
                setActiveSection(item.index);
              }}
              className={`text-left text-sm py-2 tracking-widest font-semibold ${activeSection === item.index ? 'text-[#FFEA00]' : 'text-neutral-400'
                }`}
            >
              &gt; {item.label}
            </button>
          ))}
          <div className="border-t border-[#A88100]/10 pt-4 mt-2 flex justify-between items-center text-[10px] text-neutral-500">
            <span>LOC: 20.1484° N, 85.6712° E</span>
            <span className="text-[#A88100]">{time}</span>
          </div>
        </div>
      )}
    </header>
  );
}
