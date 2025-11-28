"use client";

import { useState } from "react";

export default function InstructionOverlay({ onDismiss, setScroll }) {
  const [fading, setFading] = useState(false);

  const handleDismiss = () => {
    setFading(true);
    setTimeout(onDismiss, 500);
  };

  return (
    <div
      className={`absolute inset-0 z-[6000] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="bg-black/80 border border-gold/30 p-8 rounded-2xl max-w-md text-center shadow-[0_0_50px_rgba(255,215,0,0.15)] transform transition-transform scale-100">
        <h2 className="text-3xl font-bold text-gold mb-6 tracking-widest uppercase">
          How to Traverse
        </h2>

        <div className="flex justify-center gap-12 mb-8 text-white/80">
          {/* Scroll Icon */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center p-1">
              <div className="w-1 h-3 bg-gold rounded-full animate-bounce mt-1" />
            </div>
            <span className="text-xs tracking-wider uppercase font-bold">
              Scroll
            </span>
          </div>

          {/* Click Icon */}
          <div className="flex flex-col items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 stroke-white/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 9l6 6-6 6" />
              <path d="M4 4v7a4 4 0 0 0 4 4h12" />
            </svg>
            <span className="text-xs tracking-wider uppercase font-bold">
              Interact
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          Scroll to move between stones. <br />
          Click on floating text to open links.
        </p>

        <button
          onClick={() => {
            handleDismiss();
            setScroll(true);
          }}
          className="px-8 py-3 bg-gold text-black font-bold uppercase tracking-widest bg-white hover:bg-black hover: border hover:text-white transition-colors rounded-sm"
        >
          Begin Journey
        </button>
      </div>
    </div>
  );
}
