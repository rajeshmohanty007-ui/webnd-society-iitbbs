import React, { useRef } from "react";
import { Project } from "../types";
import { Eye } from "lucide-react";

interface TiltCardProps {
    project: Project;
    index: number;
    onClick: () => void;
    key?: React.Key;
}

function TiltProjectCard({ project, index, onClick }: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x coordinate inside element
        const y = e.clientY - rect.top;  // y coordinate inside element

        // Calculate normalized coords (-0.5 to 0.5)
        const normalizedX = x / rect.width - 0.5;
        const normalizedY = y / rect.height - 0.5;

        // Set rotation angles (tilt range: max 15 degrees)
        const rotateY = normalizedX * 16;
        const rotateX = -normalizedY * 16;

        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                transform: 'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
                transition: 'transform 0.1s ease-out',
            }}
            className="w-[300px] sm:w-[360px] h-[340px] bg-neutral-900/45 border border-[#A88100]/20 hover:border-[#FFEA00]/60 p-6 flex flex-col justify-between relative group cursor-pointer rounded-sm overflow-hidden select-none"
        >
            {/* Background Matrix/Grid Overlay inside the card */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none" />

            {/* Decorative corner rules */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#A88100]/40 group-hover:border-[#FFEA00] transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#A88100]/40 group-hover:border-[#FFEA00] transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#A88100]/40 group-hover:border-[#FFEA00] transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#A88100]/40 group-hover:border-[#FFEA00] transition-colors" />

            {/* Top Section */}
            <div className="flex justify-between items-start z-10">
                <span className="font-mono text-[9px] text-[#A88100] tracking-widest font-bold">
                    PROJ_TRACK // 0{index + 1}
                </span>
                <span className="font-mono text-[9px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-sm border border-[#A88100]/10">
                    {project.year}
                </span>
            </div>

            {/* Core Details */}
            <div className="my-auto space-y-3 z-10">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                    {project.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#FFEA00] transition-colors font-sans leading-tight">
                    {project.title}
                </h3>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-3">
                    {project.summary}
                </p>
            </div>

            {/* Footer trigger */}
            <div className="flex justify-between items-center z-10 pt-4 border-t border-neutral-900">
                <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[8px] font-mono text-neutral-400 px-1.5 py-0.5 bg-neutral-950 border border-neutral-900">
                            {tag}
                        </span>
                    ))}
                </div>

                <button className="flex items-center gap-1.5 font-mono text-[9px] text-[#FFEA00] tracking-widest font-semibold uppercase group-hover:translate-x-1 transition-transform">
                    <span>EXPAND</span>
                    <Eye size={12} />
                </button>
            </div>
        </div>
    );
}

export default TiltProjectCard;