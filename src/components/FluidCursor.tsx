import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  decay: number;
  type: 'smoke' | 'spark';
}

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  
  const cursorDotRef = useRef({ x: 0, y: 0 });
  const cursorRingRef = useRef({ x: 0, y: 0 });
  const ringScaleRef = useRef(1.0);
  const ringRotationRef = useRef(0);
  
  const dotElRef = useRef<HTMLDivElement>(null);
  const ringElRef = useRef<HTMLDivElement>(null);
  const containerElRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Detect mobile / touch devices
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobile);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Canvas size initialization
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial mouse coordinate positioning
    const handleInitialMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseRef.current = { x: clientX, y: clientY };
      lastMouseRef.current = { x: clientX, y: clientY };
      cursorDotRef.current = { x: clientX, y: clientY };
      cursorRingRef.current = { x: clientX, y: clientY };
      setIsVisible(true);
      window.removeEventListener('mousemove', handleInitialMove);
    };
    window.addEventListener('mousemove', handleInitialMove);

    // Mouse movement updates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleInitialMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile]);

  // Global hover detection for links, buttons, inputs, and interactive cards
  useEffect(() => {
    if (isMobile) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isClickable = target.closest('a, button, input, select, textarea, [role="button"], .clickable, .interactive-hover, [onclick]') !== null;
      
      let hasPointerCursor = false;
      try {
        const computedStyle = window.getComputedStyle(target);
        hasPointerCursor = computedStyle.cursor === 'pointer';
      } catch (err) {
        // ignore issues with reading styles
      }

      if (isClickable || hasPointerCursor) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isMobile]);

  // Handle clicks to emit spark/expansion burst
  useEffect(() => {
    if (isMobile) return;

    const handleMouseDown = () => {
      ringScaleRef.current = 0.6; // brief contraction before spring expand
      if (dotElRef.current) {
        dotElRef.current.style.transform = `translate3d(${cursorDotRef.current.x}px, ${cursorDotRef.current.y}px, 0) translate(-50%, -50%) scale(1.6)`;
        dotElRef.current.style.backgroundColor = '#ffffff';
      }

      // Add click burst particles
      const count = 18;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const force = 3 + Math.random() * 5;
        const colorVal = Math.random() > 0.4 ? 'rgba(255, 234, 0,' : 'rgba(255, 255, 255,'; // neon yellow or bright white sparks
        particlesRef.current.push({
          x: mouseX,
          y: mouseY,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force,
          size: 2 + Math.random() * 3,
          alpha: 1.0,
          color: colorVal,
          life: 1.0,
          decay: 0.03 + Math.random() * 0.02,
          type: 'spark'
        });
      }
    };

    const handleMouseUp = () => {
      ringScaleRef.current = isHovered ? 1.8 : 1.0;
      if (dotElRef.current) {
        dotElRef.current.style.backgroundColor = '#FFEA00';
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile, isHovered]);

  const particlesRef = useRef<Particle[]>([]);

  // Main high-performance render loop
  useEffect(() => {
    if (isMobile) return;

    let animationId: number;

    const updateAndRender = () => {
      // 1. Smooth lerping coordinates for Custom DOM cursor
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      cursorDotRef.current.x += (mouseX - cursorDotRef.current.x) * 0.35;
      cursorDotRef.current.y += (mouseY - cursorDotRef.current.y) * 0.35;

      cursorRingRef.current.x += (mouseX - cursorRingRef.current.x) * 0.12;
      cursorRingRef.current.y += (mouseY - cursorRingRef.current.y) * 0.12;

      // 2. Animate Ring properties (scale & rotation)
      const targetScale = isHovered ? 1.8 : 1.0;
      ringScaleRef.current += (targetScale - ringScaleRef.current) * 0.15;

      const rotSpeed = isHovered ? 2.5 : 0.6;
      ringRotationRef.current += rotSpeed;

      // Apply transformations to DOM elements directly for buttery smooth 60fps
      if (containerElRef.current) {
        containerElRef.current.style.opacity = isVisible ? '1' : '0';
      }

      if (dotElRef.current) {
        dotElRef.current.style.transform = `translate3d(${cursorDotRef.current.x}px, ${cursorDotRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringElRef.current) {
        ringElRef.current.style.transform = `translate3d(${cursorRingRef.current.x}px, ${cursorRingRef.current.y}px, 0) translate(-50%, -50%) rotate(${ringRotationRef.current}deg) scale(${ringScaleRef.current})`;
      }

      // 3. Update particle simulation
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (canvas && ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate current frame mouse speed
        const dx = mouseX - lastMouseRef.current.x;
        const dy = mouseY - lastMouseRef.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy);

        // Save last mouse coordinates for next frame
        lastMouseRef.current = { x: mouseX, y: mouseY };

        // Spawn trailing particles based on movement speed
        if (speed > 1.2 && particlesRef.current.length < 200) {
          // Spawn rate proportional to movement speed
          const spawnCount = Math.min(3, Math.ceil(speed / 4));
          for (let k = 0; k < spawnCount; k++) {
            // Jitter starting point along the movement path
            const ratio = k / spawnCount;
            const startX = lastMouseRef.current.x + dx * ratio;
            const startY = lastMouseRef.current.y + dy * ratio;

            const isSmoke = Math.random() > 0.35;
            
            if (isSmoke) {
              // Soft billowing fluid smoke particle
              particlesRef.current.push({
                x: startX,
                y: startY,
                // Inertia from mouse speed plus small random puff direction
                vx: -dx * 0.15 + (Math.random() - 0.5) * 1.5,
                vy: -dy * 0.15 + (Math.random() - 0.5) * 1.5,
                size: 6 + Math.random() * 8,
                alpha: 0.45,
                // Yellow tint, gold tint or dark ochre
                color: Math.random() > 0.5 ? 'rgba(255, 234, 0,' : 'rgba(168, 129, 0,',
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                type: 'smoke'
              });
            } else {
              // High-speed digital spark trailing
              particlesRef.current.push({
                x: startX,
                y: startY,
                vx: -dx * 0.2 + (Math.random() - 0.5) * 3,
                vy: -dy * 0.2 + (Math.random() - 0.5) * 3,
                size: 2 + Math.random() * 2,
                alpha: 0.9,
                color: 'rgba(255, 234, 0,',
                life: 1.0,
                decay: 0.04 + Math.random() * 0.03,
                type: 'spark'
              });
            }
          }
        }

        // Draw and update active particles
        ctx.globalCompositeOperation = 'screen'; // additive blend mode for glowing look

        particlesRef.current = particlesRef.current.filter((p) => {
          // Physics updates
          p.x += p.vx;
          p.y += p.vy;

          if (p.type === 'smoke') {
            // Smoke rises slightly (buoyancy) and is slowed by air drag
            p.vy -= 0.04;
            p.vx *= 0.94;
            p.vy *= 0.94;
            // Expand size slightly as smoke dissipates
            p.size += 0.12;
          } else {
            // Sparks fall slightly under gravity and have high air resistance
            p.vy += 0.03;
            p.vx *= 0.88;
            p.vy *= 0.88;
            // Shrink size as they fade
            p.size = Math.max(0.2, p.size - 0.03);
          }

          // Fade out life
          p.life -= p.decay;
          p.alpha = Math.max(0, p.life * (p.type === 'smoke' ? 0.45 : 0.9));

          if (p.life <= 0 || p.size <= 0) {
            return false; // remove particle
          }

          // Draw the particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          
          if (p.type === 'smoke') {
            // Draw smoke as a soft radial gradient/feathered glow
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, `${p.color}${p.alpha})`);
            gradient.addColorStop(0.3, `${p.color}${p.alpha * 0.4})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
          } else {
            // Draw sparks as solid bright points
            ctx.fillStyle = `${p.color}${p.alpha})`;
          }
          
          ctx.fill();
          return true;
        });
      }

      animationId = requestAnimationFrame(updateAndRender);
    };

    animationId = requestAnimationFrame(updateAndRender);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isMobile, isHovered, isVisible]);

  if (isMobile) return null;

  return (
    <div
      ref={containerElRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999] transition-opacity duration-350 ease-out opacity-0"
    >
      {/* 2D Canvas for fluid smoke and digital sparks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Target Center Dot */}
      <div
        ref={dotElRef}
        className="absolute w-1.5 h-1.5 rounded-full bg-[#FFEA00] shadow-[0_0_8px_#FFEA00] will-change-transform transition-[background-color,transform] duration-200"
        style={{ transform: 'translate3d(0, 0, 0) translate(-50%, -50%)' }}
      />

      {/* Custom HUD Brackets Ring */}
      <div
        ref={ringElRef}
        className="absolute w-7 h-7 flex items-center justify-center pointer-events-none will-change-transform transition-[border-color,width,height] duration-200"
        style={{ transform: 'translate3d(0, 0, 0) translate(-50%, -50%)' }}
      >
        {/* Render a futuristic HUD circle with dashed accents */}
        <div className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-200 ${
          isHovered ? 'border-[#FFEA00] opacity-80' : 'border-[#A88100]/40'
        }`} />
        
        {/* Concentric rotating micro brackets inside */}
        <div className={`absolute w-[60%] h-[60%] border-t border-b rounded-full transition-colors duration-200 ${
          isHovered ? 'border-[#FFEA00] opacity-100 scale-110' : 'border-[#FFEA00]/30'
        }`} />
      </div>
    </div>
  );
}
