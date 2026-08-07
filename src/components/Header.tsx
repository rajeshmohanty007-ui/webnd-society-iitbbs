import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Flame, Menu, X } from 'lucide-react';
import { useStore } from '../context/useStore';
import logo from '../../assets/logo.png';

interface HeaderProps {
  activeSection: number;
  setActiveSection: React.Dispatch<React.SetStateAction<number>>;
  scrollToSection: (index: number) => void;
}

export default function Header({ activeSection, setActiveSection, scrollToSection }: HeaderProps) {
  const [time, setTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAutoScrollEnabled, setIsAutoScrollEnabled } = useStore();

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
        <img src={logo} alt="Web & Design Society logo" className="w-8 h-8 object-contain hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_3px_rgba(255,234,0,0.5)]" />
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
      <div className="hidden lg:flex items-center gap-6 text-[10px] text-neutral-400">
        {/* Toggle Option */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none border border-[#A88100]/20 bg-black/40 px-3 py-1.5 rounded-sm hover:border-[#FFEA00] transition-all">
          <input
            type="checkbox"
            checked={isAutoScrollEnabled}
            onChange={(e) => setIsAutoScrollEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-6 h-3 bg-neutral-800 rounded-full relative peer-checked:bg-[#FFEA00] transition-colors">
            <div className={`absolute top-[2px] left-[2px] w-2 h-2 rounded-full transition-all duration-200 ${isAutoScrollEnabled ? 'bg-black translate-x-3' : 'bg-neutral-400'
              }`} />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 peer-checked:text-[#FFEA00] transition-colors">
            AUTOSCROLL <span className="text-[8px] text-neutral-500 font-bold">(MOUSE RECOMMENDED)</span>
          </span>
        </label>

        <div className="flex flex-col items-end border-l border-[#A88100]/20 pl-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFEA00] animate-pulse" />
            <span className="text-[#FFEA00] uppercase tracking-wider">SYSTEM ACTIVE</span>
          </div>
          <span className="font-mono mt-1 text-[11px] text-[#A88100] font-semibold">{time}</span>
        </div>
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
