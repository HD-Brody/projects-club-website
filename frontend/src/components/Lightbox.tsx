import React from "react";

interface LightboxProps {
  images: Array<{ src: string; alt: string }>;
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, activeIndex, onClose, onPrev, onNext }: LightboxProps) {
  return (
    <div 
      role="dialog" 
      aria-modal 
      className="fixed inset-0 z-[60] bg-black/70 grid place-items-center p-4" 
      style={{ contain: "layout paint" }}
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
        <img 
          src={images[activeIndex].src} 
          alt={images[activeIndex].alt} 
          className="w-full h-auto rounded-2xl shadow-2xl" 
          loading="eager" 
          decoding="async"
        />
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 ring-1 ring-slate-300 grid place-items-center"
        >
          ✕
        </button>
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
          <button 
            aria-label="Prev" 
            onClick={onPrev} 
            className="h-10 w-10 rounded-full bg-white/90 ring-1 ring-slate-300 grid place-items-center"
          >
            ‹
          </button>
          <button 
            aria-label="Next" 
            onClick={onNext} 
            className="h-10 w-10 rounded-full bg-white/90 ring-1 ring-slate-300 grid place-items-center"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Lightbox);
