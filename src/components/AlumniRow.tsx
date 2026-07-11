import React, { useState, useEffect } from 'react'
import { Github, Linkedin } from 'lucide-react';
import { Member } from '../types';

function AlumniRow({ member }: { member: Member; key?: string }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-[#FFEA00]/5 transition-colors group font-mono">
            <div className="space-y-1 sm:space-y-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                <span className="text-xs font-bold text-[#A88100] tracking-widest w-24">
                    ALUMNI_NODE //
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-[#FFEA00] transition-colors uppercase">
                    {member.name}
                </h4>
                <span className="text-xs text-neutral-400 text-neutral-500">
                    • {member.role}
                </span>
            </div>

            <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <div className="flex items-center gap-3">
                    {member.github && (
                        <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-[#FFEA00] transition-colors"
                        >
                            <Github size={14} />
                        </a>
                    )}
                    {member.linkedin && (
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-[#FFEA00] transition-colors"
                        >
                            <Linkedin size={14} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
export default AlumniRow;