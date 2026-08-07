/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from './context/useStore';
import Header from './components/Header';
import GlobalCanvas from './pages/GlobalCanvas';
import FluidCursor from './components/FluidCursor';
import HeroSection from './pages/HeroSection';
import MemberSection from './pages/MemberSection';
import ProjectsSection from './pages/ProjectsSection';
import AboutSection from './pages/AboutSection';
import ContactSection from './pages/ContactSection';

export default function App() {
  const { setMouse, scrollProgress, setScrollProgress, projectScroll, setProjectScroll, isAutoScrollEnabled } = useStore();
  const [activeSection, setActiveSection] = useState(0);
  const [targetScroll, setTargetScroll] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  const canAutoScroll = isAutoScrollEnabled && !isMobileOrTablet;

  const activeSectionRef = useRef(activeSection);
  const projectScrollRef = useRef(projectScroll);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 750; // ms transition lock to prevent spinning multiple sections

  const isDragging = useRef(false);
  const pointerStartY = useRef(0);
  const pointerStartX = useRef(0);
  const touchStartScrollTop = useRef(0);
  const touchStartProjScroll = useRef(0);

  // Update refs to prevent listener thrashing
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    projectScrollRef.current = projectScroll;
  }, [projectScroll]);

  // Synchronize normalized mouse coords [-1, 1] globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMouse]);

  // Check if device screen width represents mobile or tablet (screen width < 1024px)
  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Smooth lerping scroll animation loop driving transition effects
  useEffect(() => {
    let animationId: number;
    let current = scrollProgress;

    const update = () => {
      const diff = targetScroll - current;
      if (Math.abs(diff) > 0.001) {
        current += diff * 0.085; // smooth easing increment
        setScrollProgress(current);
      } else {
        current = targetScroll;
        setScrollProgress(current);
      }
      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [targetScroll, scrollProgress, setScrollProgress]);

  // Handle custom scrolling events (wheel, touch, keyboard)
  useEffect(() => {
    if (!canAutoScroll) return;
    const handleWheel = (e: WheelEvent) => {
      const curSection = activeSectionRef.current;
      const curProjScroll = projectScrollRef.current;

      // Find the scrollable container inside the active section
      const activeSecEl = document.getElementById(`page-section-${curSection}`);
      if (activeSecEl) {
        const { scrollTop, scrollHeight, clientHeight } = activeSecEl;
        const isScrollable = scrollHeight > clientHeight + 5;

        if (isScrollable) {
          // If we are scrolling down, check if we reached the bottom
          if (e.deltaY > 0 && scrollTop + clientHeight < scrollHeight - 5) {
            return; // Let normal scrolling happen, don't transition
          }
          // If we are scrolling up, check if we reached the top
          if (e.deltaY < 0 && scrollTop > 5) {
            return; // Let normal scrolling happen, don't transition
          }
        }
      }

      // If active section is the Projects horizontal track (Section 2)
      if (curSection === 2) {
        // If scrolling down and track is not finished
        if (e.deltaY > 0 && curProjScroll < 1) {
          e.preventDefault();
          setProjectScroll(Math.min(1.0, curProjScroll + 0.08));
          return;
        }
        // If scrolling up and track is not at start
        if (e.deltaY < 0 && curProjScroll > 0) {
          e.preventDefault();
          setProjectScroll(Math.max(0.0, curProjScroll - 0.08));
          return;
        }
      }

      // Transition between sections
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = Math.min(4, Math.max(0, curSection + direction));

      if (nextSection !== curSection) {
        setTargetScroll(nextSection);
        setActiveSection(nextSection);
        lastScrollTime.current = now;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [canAutoScroll, setProjectScroll]);

  // Handle manual pointer tracking for screen-by-screen navigation (disables native touch momentum transitions)
  useEffect(() => {
    if (!canAutoScroll) return;
    const handlePointerDown = (e: PointerEvent) => {
      // Only drag with left mouse click or touch points
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      const curSection = activeSectionRef.current;
      const activeSecEl = document.getElementById(`page-section-${curSection}`);

      pointerStartY.current = e.clientY;
      pointerStartX.current = e.clientX;
      touchStartScrollTop.current = activeSecEl ? activeSecEl.scrollTop : 0;
      touchStartProjScroll.current = projectScrollRef.current;
      isDragging.current = true;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;

      const curSection = activeSectionRef.current;
      const activeSecEl = document.getElementById(`page-section-${curSection}`);
      const deltaY = pointerStartY.current - e.clientY; // positive = dragged up (scroll down)
      const deltaX = pointerStartX.current - e.clientX;

      let isAtBottom = true;
      let isAtTop = true;

      if (activeSecEl) {
        const { scrollTop, scrollHeight, clientHeight } = activeSecEl;
        const isScrollable = scrollHeight > clientHeight + 5;
        if (isScrollable) {
          isAtBottom = touchStartScrollTop.current + clientHeight >= scrollHeight - 8;
          isAtTop = touchStartScrollTop.current <= 5;
        }
      }

      // If active section is the horizontal projects slide, let it handle its own pointer drag if horizontal
      if (curSection === 2) {
        const useHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        if (useHorizontal) {
          return;
        }
      }

      const isDraggingDownAtBottom = deltaY > 0 && isAtBottom && curSection < 4;
      const isDraggingUpAtTop = deltaY < 0 && isAtTop && curSection > 0;

      if (isDraggingDownAtBottom || isDraggingUpAtTop) {
        // Prevent default touch scrolling behavior in browser manually
        if (e.cancelable) e.preventDefault();
        setDragOffset(deltaY);
      } else {
        setDragOffset(0);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const curSection = activeSectionRef.current;
      const deltaY = pointerStartY.current - e.clientY;
      const deltaX = pointerStartX.current - e.clientX;
      const threshold = 80;

      // Handle horizontal swipe in Projects section
      if (curSection === 2) {
        const useHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        if (useHorizontal && Math.abs(deltaX) >= 40) {
          const startProjScroll = touchStartProjScroll.current;
          if (deltaX > 0) {
            if (startProjScroll < 1) {
              setProjectScroll(Math.min(1.0, projectScrollRef.current + 0.25));
            }
          } else {
            if (startProjScroll > 0) {
              setProjectScroll(Math.max(0.0, projectScrollRef.current - 0.25));
            }
          }
        }
      }

      // Handle vertical page transitions if we dragged past the threshold
      if (Math.abs(deltaY) >= threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
        const now = Date.now();
        if (now - lastScrollTime.current >= scrollCooldown) {
          const direction = deltaY > 0 ? 1 : -1;
          const nextSection = Math.min(4, Math.max(0, curSection + direction));
          if (nextSection !== curSection) {
            setTargetScroll(nextSection);
            setActiveSection(nextSection);
            lastScrollTime.current = now;
          }
        }
      }

      setDragOffset(0);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [canAutoScroll, setProjectScroll]);

  // Handle arrow key and PageUp/PageDown key navigation
  useEffect(() => {
    if (!canAutoScroll) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const curSection = activeSectionRef.current;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const nextSection = Math.min(4, curSection + 1);
        if (nextSection !== curSection) {
          setTargetScroll(nextSection);
          setActiveSection(nextSection);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const nextSection = Math.max(0, curSection - 1);
        if (nextSection !== curSection) {
          setTargetScroll(nextSection);
          setActiveSection(nextSection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canAutoScroll]);

  // Handle smooth scroll clicks from navigation header
  const scrollToSection = (index: number) => {
    setTargetScroll(index);
    setActiveSection(index);
  };

  // Generate responsive inline style offsets for stacked sections
  const getSectionStyle = (index: number) => {
    const diff = scrollProgress - index;
    const absDiff = Math.abs(diff);

    // Opacity fades out outside the viewport active range
    const opacity = Math.max(0, 1 - absDiff * 1.5);
    const scale = 1 - absDiff * 0.05;

    // Slide left/right based on rotation direction
    const translateX = diff * -120;

    // Apply dampened/direct vertical translation to active section during manual drag
    let translateY = 0;
    if (index === activeSection) {
      translateY = -dragOffset;
    }

    const isActive = absDiff < 0.5;

    return {
      opacity,
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      pointerEvents: isActive ? ('auto' as const) : ('none' as const),
      visibility: opacity > 0 ? ('visible' as const) : ('hidden' as const),
      // Enable CSS transitions when NOT dragging (so it snaps back smoothly when released)
      transition: dragOffset === 0 ? 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none',
    };
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[#0B0B08] text-white select-none overflow-hidden">
      {/* 1. Global Interactive Canvas background layer */}
      <GlobalCanvas />

      {/* Custom Fluid Cursor */}
      <FluidCursor />

      {/* 2. Fixed layout Header & navigation */}
      <Header activeSection={activeSection} setActiveSection={setActiveSection} scrollToSection={scrollToSection} />

      {/* 3. Foreground DOM content pages */}
      <main
        className="relative z-10 w-full h-full overflow-hidden"
      >
        {/* Section 0: Terminal/Hero Gate */}
        <div
          id="page-section-0"
          className="page-section w-full h-full flex flex-col justify-center items-center overflow-y-auto absolute inset-0"
          style={getSectionStyle(0)}
        >
          <HeroSection scrollProgress={scrollProgress} scrollToSection={scrollToSection} />
        </div>

        {/* Section 1: Digital Roster/Members Bento */}
        <div
          id="page-section-1"
          className="page-section w-full h-full overflow-y-auto absolute inset-0"
          style={getSectionStyle(1)}
        >
          <MemberSection scrollProgress={scrollProgress} />
        </div>

        {/* Section 2: Archive/Projects sliding track */}
        <div
          id="page-section-2"
          className="page-section w-full h-full overflow-y-auto absolute inset-0"
          style={getSectionStyle(2)}
        >
          <ProjectsSection scrollProgress={scrollProgress} />
        </div>

        {/* Section 3: Manifesto/About split terrain */}
        <div
          id="page-section-3"
          className="page-section w-full h-full overflow-y-auto absolute inset-0"
          style={getSectionStyle(3)}
        >
          <AboutSection />
        </div>

        {/* Section 4: Connection/Contact console */}
        <div
          id="page-section-4"
          className="page-section w-full h-full overflow-y-auto absolute inset-0"
          style={getSectionStyle(4)}
        >
          <ContactSection />
        </div>
      </main>

      {/* Global CSS adjustments */}
      <style>{`
        /* Import premium brutalist fonts directly */
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

        :root {
          font-family: 'Space Grotesk', system-ui, sans-serif;
        }

        /* Disable momentum scrolling to prevent inertia scrolling inside sections */
        .page-section {
          -webkit-overflow-scrolling: auto;
          overscroll-behavior-y: contain;
        }

        /* Hide standard layout scrollbars beautifully on desktop to match high-tech console */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #0B0B08;
        }
        ::-webkit-scrollbar-thumb {
          background: #A88100/30;
          border-radius: 2px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #FFEA00;
        }

        /* Overlay scanlines for digital signal aesthetic */
        .bg-scanlines {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(168, 129, 0, 0.15) 50%
          );
          background-size: 100% 6px;
        }
      `}</style>
    </div>
  );
}
