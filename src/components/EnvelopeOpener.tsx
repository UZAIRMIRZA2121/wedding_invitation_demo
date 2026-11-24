"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { triggerConfetti } from "@/lib/confetti";
import { playMusic } from "@/lib/audio";

interface EnvelopeOpenerProps {
  onOpen: () => void;
}

export default function EnvelopeOpener({ onOpen }: EnvelopeOpenerProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Called directly inside the click so the browser allows playback
    playMusic();

    triggerConfetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ["#d4af37", "#b88a38", "#ffffff"],
    });

    setTimeout(() => {
      onOpen();
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-[#111c14]/90 backdrop-blur-md"
    >
      <div className="relative w-full max-w-sm flex flex-col items-center">
        <div
          onClick={handleOpen}
          className="relative w-full aspect-[4/3] max-w-[360px] cursor-pointer group"
          style={{ perspective: "1000px" }}
        >
          {/* 1. Envelope back */}
          <div className="absolute inset-0 rounded-xl bg-[#172b1e] border border-[#cba354]/40 shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_0_50px_rgba(203,163,84,0.35)]" />

          {/* 2. Invitation card */}
          <motion.div
            animate={isOpening ? { y: -130, scale: 1.05 } : { y: 0, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: isOpening ? 0.5 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-5 top-5 bottom-5 z-10 bg-[#faf5eb] rounded-lg border border-[#cba354] p-4 flex flex-col items-center justify-center text-center shadow-md"
          >
            <p className="text-[9px] font-sans tracking-widest text-[#8c7146] uppercase">
              Wedding Invitation
            </p>
            <h3 className="font-script text-3xl text-[#1f3d2a] my-1 whitespace-nowrap">
              Rida <span className="text-[#b88a38]">&amp;</span> Usman
            </h3>
            <p className="text-[10px] font-serif text-[#655543]">
              15 · NOVEMBER · 2026
            </p>
          </motion.div>

          {/* 3. Front pocket */}
          <div className="absolute inset-0 z-20 rounded-xl overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#1a3224] to-[#21402d]"
              style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)" }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-l from-[#1a3224] to-[#21402d]"
              style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)" }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#13241a] to-[#1d3827]"
              style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }}
            />
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <g stroke="#cba354" strokeOpacity="0.3" strokeWidth="0.4" fill="none">
                <line x1="0" y1="0" x2="50" y2="50" vectorEffect="non-scaling-stroke" />
                <line x1="100" y1="0" x2="50" y2="50" vectorEffect="non-scaling-stroke" />
                <line x1="0" y1="100" x2="50" y2="50" vectorEffect="non-scaling-stroke" />
                <line x1="100" y1="100" x2="50" y2="50" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>
          </div>

          {/* 4. Top flap: h-1/2 so its tip lands exactly on the fold point */}
          <motion.div
            initial={false}
            animate={
              isOpening
                ? { rotateX: 180, zIndex: 5 }
                : { rotateX: 0, zIndex: 30 }
            }
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#2d4f39] to-[#1d3525] pointer-events-none"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformOrigin: "top center",
              backfaceVisibility: "visible",
            }}
          />

          {/* 5. Wax seal, exactly centered */}
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <motion.button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleOpen();
              }}
              disabled={isOpening}
              aria-label="Open invitation and play music"
              animate={
                isOpening
                  ? { scale: 1.3, opacity: 0, rotate: 20 }
                  : { scale: 1, opacity: 1, rotate: 0 }
              }
              transition={{ duration: 0.5 }}
              className="pointer-events-auto"
            >
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#cba354] via-[#e8cb85] to-[#9a6e2a] p-[2px] wax-seal-shadow flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#841b1b] to-[#4e0d0d] flex items-center justify-center border border-[#e8cb85]/60">
                  <span className="font-script text-xl leading-none text-[#fbedc7] font-bold whitespace-nowrap">
                    R &amp; U
                  </span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#cba354] flex items-center justify-center text-[10px] text-[#2b2111] shadow">
                  ❦
                </span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Open Invitation Button */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 text-center"
        >
          <button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#cba354] to-[#e7ca83] text-[#1b3424] font-sans font-semibold text-xs tracking-widest uppercase shadow-lg hover:shadow-[0_0_25px_rgba(203,163,84,0.6)] transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1b3424]" />
            <span>{isOpening ? "Opening Invitation..." : "Open Invitation"}</span>
          </button>

          <p className="text-[11px] font-serif text-[#d8c5a2] mt-2 italic tracking-wide">
            Tap the wax seal or button to open
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}