"use client";

import React, { useRef, useEffect, useState } from "react";
import { triggerConfetti } from "@/lib/confetti";
import { Sparkles, Heart } from "lucide-react";

interface ScratchCardProps {
  onRevealed?: () => void;
}

export default function ScratchCard({ onRevealed }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high DPI canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Fill with glamorous gold foil gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#d8bf8a");
    gradient.addColorStop(0.25, "#fcedc7");
    gradient.addColorStop(0.5, "#b58739");
    gradient.addColorStop(0.75, "#edd9a8");
    gradient.addColorStop(1, "#9c6e26");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Decorative foil pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    for (let x = 0; x < rect.width; x += 15) {
      for (let y = 0; y < rect.height; y += 15) {
        if ((x + y) % 30 === 0) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Shimmer text on gold foil
    ctx.fillStyle = "#3e321e";
    ctx.font = "bold 13px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ SCRATCH OR TAP HERE ✦", rect.width / 2, rect.height / 2 - 12);

    ctx.font = "italic 11px Georgia, serif";
    ctx.fillStyle = "#5c4928";
    ctx.fillText("To reveal your special blessing", rect.width / 2, rect.height / 2 + 12);
  }, []);

  const triggerReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);

    // Confetti celebration
    triggerConfetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#d4af37", "#b88a38", "#ffffff", "#314637"],
    });

    if (onRevealed) onRevealed();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      for (let i = 3; i < pixels.length; i += 16) {
        // sampled
        if (pixels[i] === 0) transparentCount += 4;
      }

      if (transparentCount / totalPixels > 0.35) {
        triggerReveal();
      }
    } catch {
      // fallback
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="relative w-full max-w-[320px] mx-auto my-3 select-none">
      {/* Hidden Message Layer Underneath */}
      <div className="w-full min-h-[160px] rounded-xl p-5 border-2 border-[#b88a38]/40 bg-gradient-to-b from-[#fffbf2] to-[#f6ecdb] shadow-inner flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-[#1b3726]/10 flex items-center justify-center text-[#244632] mb-2 animate-bounce">
          <Heart className="w-5 h-5 fill-[#b88a38] text-[#b88a38]" />
        </div>
        <p className="font-serif italic text-base md:text-lg text-[#253f2c] leading-relaxed">
          &ldquo;Your presence, prayers, and heartfelt laughter are the greatest gift of all. We truly cannot wait to celebrate our magical day with you!&rdquo;
        </p>
        <span className="mt-2 text-xs font-sans tracking-widest text-[#b88a38] uppercase font-semibold">
          ✦ With Endless Love & Duas ✦
        </span>
      </div>

      {/* Golden Scratch Overlay Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => {
          // Quick tap to reveal support
          triggerReveal();
        }}
        className={`absolute inset-0 w-full h-full rounded-xl cursor-pointer transition-opacity duration-700 touch-none shadow-md ${
          isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      {isRevealed && (
        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[#244632] font-medium animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#b88a38]" />
          <span>Revealed with Love & Joy</span>
        </div>
      )}
    </div>
  );
}
