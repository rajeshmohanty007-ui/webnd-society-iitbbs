import { create } from 'zustand';

interface StoreState {
  mouse: { x: number; y: number };
  scrollProgress: number;
  typingPulse: number;
  activeProjectId: string | null;
  projectScroll: number;
  setMouse: (x: number, y: number) => void;
  setScrollProgress: (progress: number) => void;
  triggerTypingPulse: () => void;
  setActiveProjectId: (id: string | null) => void;
  setProjectScroll: (scroll: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  mouse: { x: 0, y: 0 },
  scrollProgress: 0,
  typingPulse: 0,
  activeProjectId: null,
  projectScroll: 0,
  setMouse: (x, y) => set({ mouse: { x, y } }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  triggerTypingPulse: () => set((state) => ({ typingPulse: state.typingPulse + 1.5 })),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setProjectScroll: (scroll) => set({ projectScroll: scroll }),
}));
