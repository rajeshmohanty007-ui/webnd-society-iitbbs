import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, ArrowLeft, ArrowRight, Eye, Calendar, FolderGit2 } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS_DATA } from '../data';
import { useStore } from '../context/useStore';
import TiltProjectCard from '../components/TiltProjectCard';

interface ProjectsSectionProps {
  scrollProgress: number; // Keep prop to avoid breaking type signatures, though we use store internally
}

export default function ProjectsSection({ scrollProgress }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { projectScroll, setProjectScroll } = useStore();
  const [translateX, setTranslateX] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    const maxScrollWidth = trackRef.current.scrollWidth - window.innerWidth + 160;

    if (maxScrollWidth > 0) {
      setTranslateX(-projectScroll * maxScrollWidth);
    }
  }, [projectScroll]);

  const handleProjectClick = (project: Project) => {
    // 1. Trigger the neon yellow "Activation Expansion" flash overlay
    setFlashActive(true);
    setTimeout(() => {
      setSelectedProject(project);
      setFlashActive(false);
    }, 300); // Quick flash duration
  };

  const slideLeft = () => {
    if (isMobile) {
      if (trackRef.current) {
        trackRef.current.scrollBy({ left: -280, behavior: 'smooth' });
      }
    } else {
      setProjectScroll(Math.max(0, projectScroll - 0.25));
    }
  };

  const slideRight = () => {
    if (isMobile) {
      if (trackRef.current) {
        trackRef.current.scrollBy({ left: 280, behavior: 'smooth' });
      }
    } else {
      setProjectScroll(Math.min(1, projectScroll + 0.25));
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex flex-col justify-center select-none bg-transparent overflow-hidden"
    >
      {/* Absolute Flash Overlay for "Activation Expansion" */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#FFEA00] z-50 pointer-events-none mix-blend-difference"
          />
        )}
      </AnimatePresence>

      {/* Top Section Headers */}
      <div className="absolute top-28 left-6 md:left-12 z-20">
        <div className="font-mono text-[10px] text-[#A88100] flex items-center gap-2 tracking-widest mb-1 animate-pulse">
          <FolderGit2 size={12} className="text-[#FFEA00]" />
          <span>SEC_03 // ARCHIVE_PORTAL</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#FFEA00] font-sans">
          PROJECT ARCHIVE
        </h2>
      </div>

      <div className="absolute top-28 right-6 md:right-12 z-20 flex items-center gap-3">
        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest hidden md:inline">
          DRAG TRACK / SCROLL VERTICALLY TO DRIFT
        </span>
        <div className="flex gap-2">
          <button
            onClick={slideLeft}
            className="p-2 border border-[#A88100]/20 hover:border-[#FFEA00] bg-[#0B0B08] text-neutral-400 hover:text-[#FFEA00] rounded-sm transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={slideRight}
            className="p-2 border border-[#A88100]/20 hover:border-[#FFEA00] bg-[#0B0B08] text-neutral-400 hover:text-[#FFEA00] rounded-sm transition-all cursor-pointer"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* The Horizontal Scrolling Infinity Track */}
      <div className="w-full overflow-x-auto scrollbar-hide" ref={trackRef}>
        <motion.div
          style={isMobile ? undefined : { x: translateX }}
          transition={{ type: 'spring', damping: 25, stiffness: 60 }}
          className="flex flex-row items-center gap-8 px-8 md:px-24 w-max h-[480px]"
        >
          {PROJECTS_DATA.map((project, index) => (
            <TiltProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom status indicator */}
      <div className="absolute bottom-12 left-6 md:left-12 font-mono text-[9px] text-neutral-500 tracking-wider flex items-center gap-4">
        <span>GRID ID: PROJ_TRACK_2026</span>
        <span>•</span>
        <span>COMPILE STATE: STATIC_STABLE</span>
      </div>

      {/* Project Detail Expansion Pane Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B0B08]/98 backdrop-blur-md z-50 flex items-center justify-center p-6 md:p-12 font-mono"
          >
            <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

            <div className="relative w-full max-w-4xl bg-[#0c0c09] border border-[#A88100]/30 rounded-sm z-10 max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header/Close Button Bar */}
              <div className="flex justify-between items-center border-b border-[#A88100]/20 px-6 py-4 select-none">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">PROJECT_DETAIL // INTERFACE</span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="border border-[#A88100]/30 hover:border-[#FFEA00] text-neutral-400 hover:text-[#FFEA00] px-4 py-2 text-xs tracking-widest uppercase transition-all rounded-sm cursor-pointer"
                >
                  &lt; BACK_TO_GATEWAY
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-6 md:p-10 flex flex-col md:grid md:grid-cols-12 gap-8 overflow-y-auto">
                {/* Left Column: Title & Metas */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#FFEA00] font-bold tracking-widest mb-4">
                    <Calendar size={13} />
                    <span>YEAR: {selectedProject.year}</span>
                    <span className="text-neutral-600">|</span>
                    <span>{selectedProject.category.toUpperCase()}</span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-black uppercase text-[#FFEA00] tracking-tighter leading-none mb-6 font-sans">
                    {selectedProject.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed max-w-xl font-sans font-normal">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-[#FFEA00]/5 border border-[#A88100]/20 text-[#FFC107] px-2.5 py-1 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Generative Preview & Actions */}
              <div className="md:col-span-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#A88100]/20 pt-6 md:pt-0 md:pl-8 space-y-6">
                <div className="aspect-video w-full border border-[#A88100]/20 bg-[#0B0B08] p-4 flex flex-col justify-between relative overflow-hidden group">
                  {/* Subtle pulsing coordinate lines representing visual canvas */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-15" />
                  <span className="text-[8px] text-neutral-600 uppercase">PREVIEW_ENGINE_ACTIVE</span>
                  <div className="my-auto text-center space-y-2 relative z-10">
                    <span className="text-3xl text-[#FFC107] font-black tracking-widest animate-pulse">
                      // {selectedProject.imageSeed.toUpperCase()} //
                    </span>
                  </div>
                  <span className="text-[8px] text-neutral-600 uppercase text-right">
                    LOC: 20.1484° N, 85.6712° E
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-[9px] text-[#A88100] tracking-widest font-bold block mb-1">
                    EXECUTE_LINKS:
                  </span>
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between border border-[#FFEA00]/30 hover:border-[#FFEA00] bg-[#FFEA00]/5 hover:bg-[#FFEA00]/10 py-3.5 px-5 text-xs text-[#FFEA00] tracking-widest uppercase transition-all rounded-sm"
                    >
                      <span>REPOSITORY_SOURCE</span>
                      <Github size={14} />
                    </a>
                  )}
                  {selectedProject.demo && (
                    <a
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between border border-neutral-700 hover:border-white bg-transparent py-3.5 px-5 text-xs text-white tracking-widest uppercase transition-all rounded-sm"
                    >
                      <span>LIVE_DEMO_INSTANCE</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .bg-grid-pattern {
          background-size: 10px 10px;
          background-image: linear-gradient(to right, rgba(168, 129, 0, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(168, 129, 0, 0.1) 1px, transparent 1px);
        }
        .bg-radial-glow {
          background: radial-gradient(circle, rgba(255, 234, 0, 0.15) 0%, transparent 70%);
        }
      `}</style>
    </section>
  );
}

