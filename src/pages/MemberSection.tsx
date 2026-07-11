import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, ShieldAlert, Cpu, Sparkles, Network } from 'lucide-react';
import InteractiveMemberCard from '../components/InteractiveMemberCard';
import AlumniRow from '../components/AlumniRow';
import { Member } from '../types';
import { MEMBERS_DATA } from '../data';

interface MemberSectionProps {
  scrollProgress: number;
}

export default function MemberSection({ scrollProgress }: MemberSectionProps) {
  const executives = MEMBERS_DATA.filter((m) => m.category === 'executive');
  const coreMembers = MEMBERS_DATA.filter((m) => m.category === 'core');
  const alumniList = MEMBERS_DATA.filter((m) => m.category === 'alumni');

  return (
    <section className="relative min-h-screen w-full py-28 px-6 md:px-12 flex flex-col justify-start select-none bg-transparent">
      {/* Top Section Header */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#A88100]/30 pb-6 mb-16 gap-6">
        <div>
          <div className="font-mono text-[10px] text-[#A88100] flex items-center gap-2 tracking-widest mb-2 animate-pulse">
            <Cpu size={12} className="text-[#FFEA00]" />
            <span>SEC_02 // DIGITAL_ROSTER_CORE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#FFEA00] font-sans">
            SOCIETY ROSTER
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-2 max-w-md">
            The multi-disciplinary matrix of engineers and designers driving the visual language of IIT Bhubaneswar.
          </p>
        </div>

        <div className="font-mono text-[10px] text-neutral-500 text-left md:text-right">
          <p>ACTIVE NODES: {MEMBERS_DATA.length}</p>
          <p>STREAK_INDEX: 2021-2026</p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto space-y-20">
        {/* CATEGORY 1: POSITION HOLDERS (Executive Team) */}
        <div>
          <div className="sticky top-20 z-20 bg-[#0B0B08]/95 backdrop-blur-sm py-4 px-2 border-b border-[#A88100]/20 mb-8 flex justify-between items-center font-mono xl:scale-x-110 xl:px-6">
            <span className="text-sm font-bold text-[#FFEA00] tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-[#FFEA00]" /> 01 // THE COUNCIL
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">POSITION HOLDERS </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {executives.map((member) => (
              <div key={member.id} className="h-fit">
                <InteractiveMemberCard member={member} isExecutive image={member.image} />
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORY 2: CORE MEMBERS (Development & Design Grid) */}
        <div>
          <div className="sticky top-20 z-20 bg-[#0B0B08]/95 backdrop-blur-sm py-4 px-2 border-b border-[#A88100]/20 mb-8 flex justify-between items-center font-mono xl:scale-x-110 xl:px-6">
            <span className="text-sm font-bold text-[#FFEA00] tracking-widest flex items-center gap-2">
              <Network size={14} className="text-[#FFEA00]" /> 02 // CORE COMMITTEE TEAM
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">POSITION HOLDERS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {coreMembers.map((member) => (
              <div key={member.id} className="h-fit">
                <InteractiveMemberCard member={member} image={member.image} />
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORY 3: ALUMNI ROSTER (Compact Rows) */}
        <div>
          <div className="sticky top-20 z-20 bg-[#0B0B08]/95 backdrop-blur-sm py-4 px-2 border-b border-[#A88100]/20 mb-8 flex justify-between items-center font-mono xl:scale-x-110 xl:px-6">
            <span className="text-sm font-bold text-[#FFEA00] tracking-widest flex items-center gap-2">
              <ShieldAlert size={14} className="text-[#FFEA00]" /> 03 // ALUMNI & MENTORS
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">DENSE COMPACT TRACKS</span>
          </div>

          <div className="border border-[#A88100]/20 divide-y divide-[#A88100]/10 bg-neutral-900/10 rounded-sm">
            {alumniList.map((member) => (
              <AlumniRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
