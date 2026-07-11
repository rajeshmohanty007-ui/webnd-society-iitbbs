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
  const { setMouse, scrollProgress, setScrollProgress, projectScroll, setProjectScroll } = useStore();
  const [activeSection, setActiveSection] = useState(0);
  const [targetScroll, setTargetScroll] = useState(0);

  const activeSectionRef = useRef(activeSection);
  const projectScrollRef = useRef(projectScroll);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 750; // ms transition lock to prevent spinning multiple sections
  const touchStartScrollTop = useRef(0);
  const touchStartProjScroll = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update scroll progress during native mobile scrolling
  useEffect(() => {
    if (!isMobile) return;
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      const scrollTop = mainEl.scrollTop;
      const height = mainEl.clientHeight;
      if (height === 0) return;

      const exactIndex = scrollTop / height;
      setScrollProgress(exactIndex);
    };

    mainEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, [isMobile, setScrollProgress]);



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

  // Smooth lerping scroll animation loop
  useEffect(() => {
    if (isMobile) return;
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
  }, [targetScroll, scrollProgress, setScrollProgress, isMobile]);

  // Handle custom scrolling events (wheel, touch, keyboard)
  useEffect(() => {
    if (isMobile) return;
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
        // console.log(nextSection);
        lastScrollTime.current = now;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isMobile, setProjectScroll]);

  // Handle touch swiping for mobile devices
  useEffect(() => {
    if (isMobile) return;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      const curSection = activeSectionRef.current;
      const activeSecEl = document.getElementById(`page-section-${curSection}`);
      touchStartScrollTop.current = activeSecEl ? activeSecEl.scrollTop : 0;
      touchStartProjScroll.current = projectScrollRef.current;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY; // positive = swipe up (scroll down)

      if (Math.abs(deltaY) < 50) return; // swipe threshold

      const curSection = activeSectionRef.current;
      const curProjScroll = projectScrollRef.current;

      const activeSecEl = document.getElementById(`page-section-${curSection}`);
      if (activeSecEl) {
        const { clientHeight, scrollHeight } = activeSecEl;
        const isScrollable = scrollHeight > clientHeight + 5;

        if (isScrollable) {
          // If swiped up (scrolling down): transition only if we were already at bottom at start of touch
          if (deltaY > 0) {
            const wasAtBottom = touchStartScrollTop.current + clientHeight >= scrollHeight - 8;
            if (!wasAtBottom) return; // scroll natively
          }
          // If swiped down (scrolling up): transition only if we were already at top at start of touch
          if (deltaY < 0) {
            const wasAtTop = touchStartScrollTop.current <= 5;
            if (!wasAtTop) return; // scroll natively
          }
        }
      }

      if (curSection === 2) {
        const startProjScroll = touchStartProjScroll.current;
        if (deltaY > 0) {
          if (startProjScroll < 1) {
            setProjectScroll(Math.min(1.0, curProjScroll + 0.25));
            return;
          }
        } else {
          if (startProjScroll > 0) {
            setProjectScroll(Math.max(0.0, curProjScroll - 0.25));
            return;
          }
        }
      }

      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) return;

      const direction = deltaY > 0 ? 1 : -1;
      const nextSection = Math.min(4, Math.max(0, curSection + direction));

      if (nextSection !== curSection && !isMobile) {
        setTargetScroll(nextSection);
        setActiveSection(nextSection);
        console.log(nextSection, isMobile);
        lastScrollTime.current = now;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, setProjectScroll]);

  // Handle arrow key and PageUp/PageDown key navigation
  useEffect(() => {
    if (isMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const curSection = activeSectionRef.current;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const nextSection = Math.min(4, curSection + 1);
        if (nextSection !== curSection) {
          setTargetScroll(nextSection);
          setActiveSection(nextSection);
          // console.log(nextSection);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const nextSection = Math.max(0, curSection - 1);
        if (nextSection !== curSection) {
          setTargetScroll(nextSection);
          setActiveSection(nextSection);
          // console.log(nextSection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile]);

  // Handle smooth scroll clicks from navigation header
  const scrollToSection = (index: number) => {
    if (isMobile) {
      const el = document.getElementById(`page-section-${index}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setScrollProgress(index);
    } else {
      setTargetScroll(index);
    }
  };

  // Generate responsive inline style offsets for stacked sections
  const getSectionStyle = (index: number) => {
    if (isMobile) {
      return {};
    }

    const diff = scrollProgress - index;
    const absDiff = Math.abs(diff);

    // Opacity fades out outside the viewport active range
    const opacity = Math.max(0, 1 - absDiff * 1.5);
    const scale = 1 - absDiff * 0.05;

    // Slide left/right based on rotation direction
    const translateX = diff * -120;

    const isActive = absDiff < 0.5;

    return {
      opacity,
      transform: `translateX(${translateX}px) scale(${scale})`,
      pointerEvents: isActive ? ('auto' as const) : ('none' as const),
      visibility: opacity > 0 ? ('visible' as const) : ('hidden' as const),
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
        ref={mainRef}
        className={`relative z-10 w-full h-full ${isMobile ? 'overflow-y-auto snap-y snap-mandatory scroll-smooth' : 'overflow-hidden'}`}
      >
        {/* Section 0: Terminal/Hero Gate */}
        <div
          id="page-section-0"
          className={`page-section w-full h-full flex flex-col justify-center items-center overflow-y-auto ${isMobile ? 'relative snap-start shrink-0' : 'absolute inset-0'}`}
          style={getSectionStyle(0)}
        >
          <HeroSection scrollProgress={scrollProgress} scrollToSection={scrollToSection} />
        </div>

        {/* Section 1: Digital Roster/Members Bento */}
        <div
          id="page-section-1"
          className={`page-section w-full h-full overflow-y-auto ${isMobile ? 'relative snap-start shrink-0' : 'absolute inset-0'}`}
          style={getSectionStyle(1)}
        >
          <MemberSection scrollProgress={scrollProgress} />
        </div>

        {/* Section 2: Archive/Projects sliding track */}
        <div
          id="page-section-2"
          className={`page-section w-full h-full overflow-y-auto ${isMobile ? 'relative snap-start shrink-0' : 'absolute inset-0'}`}
          style={getSectionStyle(2)}
        >
          <ProjectsSection scrollProgress={scrollProgress} />
        </div>

        {/* Section 3: Manifesto/About split terrain */}
        <div
          id="page-section-3"
          className={`page-section w-full h-full overflow-y-auto ${isMobile ? 'relative snap-start shrink-0' : 'absolute inset-0'}`}
          style={getSectionStyle(3)}
        >
          <AboutSection />
        </div>

        {/* Section 4: Connection/Contact console */}
        <div
          id="page-section-4"
          className={`page-section w-full h-full overflow-y-auto ${isMobile ? 'relative snap-start shrink-0' : 'absolute inset-0'}`}
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

        /* Momentum scrolling and boundary containment for mobile */
        .page-section {
          -webkit-overflow-scrolling: touch;
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
      `}</style>
    </div>
  );
}
