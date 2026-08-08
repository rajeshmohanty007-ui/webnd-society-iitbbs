import { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Member } from '../types';
// @ts-ignore
import sampleImg from '@/assets/Sample2.JPG';

function InteractiveMemberCard({ member, isExecutive = false, image }: { member: Member; isExecutive?: boolean; image?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hovered, setHovered] = useState(false);

    const getImageUrl = () => {
        if (!image) return undefined;
        if (image === 'assests/Sample2.jpg' || image.includes('Sample2.JPG') || image.includes('Sample2.jpg')) {
            return sampleImg;
        }
        return image;
    };

    const resolvedImage = getImageUrl();
    const hoverProgressRef = useRef(0);
    const animationFrameRef = useRef<number>(0);
    const isMountedRef = useRef(true);

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
        if (isMobile) return;
        isMountedRef.current = true;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
        let height = (canvas.height = canvas.parentElement?.clientHeight || 300);

        // Procedural parameters based on member's name as a seed
        const seedValue = member.imageSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const numRings = isExecutive ? 8 : 6;
        const maxRadius = Math.min(width, height) * 0.42;



        const handleResize = () => {
            if (!isMountedRef.current || !canvas) return;
            width = canvas.width = canvas.parentElement?.clientWidth || 300;
            height = canvas.height = canvas.parentElement?.clientHeight || 300;
        };
        window.addEventListener('resize', handleResize);

        let time = 0;

        const render = () => {
            if (!isMountedRef.current) return;
            time += 0.015;

            // Smoothly interpolate hover state progress
            const targetHover = hovered ? 1 : 0;
            hoverProgressRef.current += (targetHover - hoverProgressRef.current) * 0.12;
            const hover = hoverProgressRef.current;

            // Clear Canvas
            ctx.fillStyle = '#0B0B08';
            ctx.fillRect(0, 0, width, height);

            // Subtle cyber scanning grid lines in background
            ctx.strokeStyle = `rgba(168, 129, 0, ${0.03 + hover * 0.06})`;
            ctx.lineWidth = 0.5;
            const spacing = 15;
            for (let x = 0; x < width; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw Generative Geometric Digital Portrait (The Cyber-Gold visual)
            const cx = width / 2;
            const cy = height / 2 - 10;





            // Live status horizontal bar at the top of the canvas
            ctx.fillStyle = hovered ? 'rgba(255, 234, 0, 0.15)' : 'rgba(168, 129, 0, 0.05)';
            ctx.fillRect(0, 0, width, 4);

            // Random terminal code lines superimposed on bottom corners (Glitch look)
            if (hover > 0.4 && Math.random() > 0.8) {
                ctx.fillStyle = 'rgba(255, 234, 0, 0.4)';
                ctx.font = '8px monospace';
                ctx.fillText(`ID_GRID_SYNC: OK`, 12, height - 16);
                ctx.fillText(`LATENCY: 0.05ms`, width - 90, height - 16);
            }

            // Check if we can suspend the loop to save CPU when card is static
            if (!hovered && hoverProgressRef.current < 0.005) {
                hoverProgressRef.current = 0;
                return; // stop requesting new animation frames
            }

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            isMountedRef.current = false;
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [hovered, member.imageSeed, isExecutive, isMobile]);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative w-full aspect-square bg-[#0B0B08] border border-[#A88100]/20 hover:border-[#FFEA00]/60 rounded-sm overflow-hidden flex flex-col justify-end p-5 transition-all duration-300 group"
            id={`member-card-${member.id}`}
        >
            {/* Absolute canvas container simulating the WebGL plane */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {!isMobile ? (
                    <canvas ref={canvasRef} className="w-full h-full" />
                ) : (
                    <div
                        className="w-full h-full bg-[#0B0B08] relative overflow-hidden"
                        style={{
                            backgroundSize: '15px 15px',
                            backgroundImage: `linear-gradient(to right, rgba(168, 129, 0, 0.03) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(168, 129, 0, 0.03) 1px, transparent 1px)`
                        }}
                    >
                        {/* A beautiful static concentric blueprint design for mobile cards */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-[#A88100]/10" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#A88100]/15" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-[#A88100]/20" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#FFEA00]/15" />
                        {/* Dynamic corner markings */}
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#A88100]/40" />
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#A88100]/40" />
                        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#A88100]/40" />
                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#A88100]/40" />
                    </div>
                )}
            </div>

            {/* Background member image overlay (Square aspect ratio, centered) */}
            {resolvedImage && (
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 aspect-square z-[5] pointer-events-none overflow-hidden select-none">
                    <img
                        src={resolvedImage}
                        alt={member.name}
                        className="w-full h-full object-cover filter grayscale opacity-25 group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-500 scale-[1.03] group-hover:scale-100"
                    />
                </div>
            )}

            {/* Solid black gradient overlay to ensure textual readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B0B08] via-[#0B0B08]/90 to-transparent pointer-events-none z-10" />

            {/* Member Details */}
            <div className="relative z-20 flex justify-between items-end w-full">
                <div className="space-y-1">
                    <span className="font-mono text-[9px] text-neutral-400 font-medium tracking-widest uppercase block">
                        {isExecutive ? `// EXECUTIVE_NODE` : `// OPERATIVE`}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#FFEA00] transition-colors font-sans">
                        {member.name}
                    </h3>
                    <p className="font-mono text-[11px] text-[#A88100] font-semibold tracking-wider">
                        {member.role}
                    </p>
                </div>

                {/* Social Link Handles (Revealed beautifully on hover) */}
                <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                    {member.github && (
                        <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-[#FFEA00] transition-colors p-1"
                        >
                            <Github size={15} />
                        </a>
                    )}
                    {member.linkedin && (
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-[#FFEA00] transition-colors p-1"
                        >
                            <Linkedin size={15} />
                        </a>
                    )}
                    {member.email && (
                        <a
                            href={`mailto:${member.email}`}
                            className="text-neutral-400 hover:text-[#FFEA00] transition-colors p-1"
                        >
                            <Mail size={15} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InteractiveMemberCard