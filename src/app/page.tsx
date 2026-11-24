"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Share2,
  RotateCcw,
} from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import AudioPlayer from "@/components/AudioPlayer";
import EnvelopeOpener from "@/components/EnvelopeOpener";
import ScratchCard from "@/components/ScratchCard";
import RsvpSection from "@/components/RsvpSection";
import EventPage from "@/components/EventPage";
import { EVENTS, EVENT_KEYS, parseInvite, Invite } from "@/lib/events";

const LABELS: Record<string, string> = {
  union: "THE HOLY UNION",
  mehndi: "MEHNDI",
  barat: "Barat",
  walima: "WALIMA",
  surprise: "SURPRISE NOTE",
  rsvp: "RSVP & GUESTBOOK",
};

export default function WeddingInvitation() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Guest invite comes from the URL using short codes:
  //   m = mehndi, b = barat, w = walima
  //   a = with family, number = that many persons
  // Examples:
  //   /?name=Ali&ma&b4&w2   -> Mehndi (family), Barat (4 persons), Walima (2 persons)
  //   /?name=Sara&ba        -> Barat only, with family
  //   /?m2&w3               -> Mehndi (2 persons) + Walima (3 persons)
  // The old format (?barat=family&mehndi=2) still works.
  // No event in the link = every event is shown (preview mode).
  const [invite, setInvite] = useState<Invite>(() => parseInvite(""));
  useEffect(() => {
    setInvite(parseInvite(window.location.search));
  }, []);

  const eventKeys = EVENT_KEYS.filter((k) => invite.events[k] !== undefined);

  // Page order is built from the link
  const pages: string[] = ["cover", "union", ...eventKeys, "surprise", "rsvp"];
  const totalPages = pages.length;
  const page = pages[currentPage];
  const nextLabel = LABELS[pages[currentPage + 1]] ?? "CONTINUE";

  const goToPage = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages || nextPage === currentPage) return;
    setDirection(nextPage > currentPage ? 1 : -1);
    setCurrentPage(nextPage);
  };

  const goNext = () => goToPage(Math.min(currentPage + 1, totalPages - 1));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight") {
        goToPage(Math.min(currentPage + 1, totalPages - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft") {
        goToPage(Math.max(currentPage - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  // Touch swipe gestures
  useEffect(() => {
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diffY = e.changedTouches[0].clientY - startY;
      if (Math.abs(diffY) > 50) {
        if (diffY < 0) {
          goToPage(Math.min(currentPage + 1, totalPages - 1));
        } else {
          goToPage(Math.max(currentPage - 1, 0));
        }
      }
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  const handleShare = () => {
    const text = "You are cordially invited to celebrate the wedding of Rida & Usman! 💍✨";
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ title: "Rida & Usman Wedding", text, url }).catch(() => { });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const pageVariants: Variants = {
    initial: (dir: number) => ({
      y: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.96,
    }),
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        y: { type: "spring", stiffness: 260, damping: 28 },
        opacity: { duration: 0.4 },
      },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.96,
      transition: {
        y: { type: "spring", stiffness: 260, damping: 28 },
        opacity: { duration: 0.35 },
      },
    }),
  };
  const DEFAULT_GUESTS = [
    "Mrs. M. Younas",
    "Mr & Mrs. M Yaqoob Shahid",
    "Mr. & Mrs. Ashraf (Late)",
    "Mr. & Mrs. Abdul Waheed",
    "Mr. & Mrs. M. Umair",
    "Mr. & Mrs. M. Uzair",
    "M. Musa",
  ];
  const linkNames = (invite.name ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);

  const guestNames = [...DEFAULT_GUESTS, ...linkNames];



  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-0 sm:p-4 bg-gradient-to-br from-[#121f16] via-[#1a3122] to-[#0e1911] overflow-hidden">
      {/* Floating Canvas Particles */}
      <FloatingParticles />

      {/* Background Ambient Audio Toggle */}
      <AudioPlayer />

      {/* Opening Envelope Experience */}
      <AnimatePresence>
        {!isEnvelopeOpened && (
          <EnvelopeOpener onOpen={() => setIsEnvelopeOpened(true)} />
        )}
      </AnimatePresence>

      {/* Main Luxury Invitation Card Viewport */}
      <div className="relative w-full sm:max-w-[430px] h-screen sm:h-[880px] sm:max-h-[calc(100vh-32px)] bg-[#faf5ec] paper-texture sm:rounded-2xl shadow-2xl sm:border-[5px] sm:border-[#e9dac0] overflow-hidden flex flex-col z-20">
        {/* Top Gold Foil Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#e8dcbe] z-30">
          <motion.div
            className="h-full bg-gradient-to-r from-[#b88a38] via-[#e5cd8d] to-[#9d6f2c]"
            animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Dynamic Pages Carousel */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            {/* COVER */}
            {page === "cover" && (
              <motion.div
                key="page-cover"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 p-6 sm:p-8 flex flex-col items-center justify-between text-center bg-gradient-to-b from-[#fffbf4] via-[#faf4e6] to-[#f4e8d3]"
              >
                <div className="relative w-full h-full border border-[#cba354]/60 p-4 sm:p-6 flex flex-col items-center justify-between outline outline-1 outline-offset-4 outline-[#d4af37]/40">
                  <span className="absolute top-1 left-1 text-[#b88a38] text-lg font-serif">⌜</span>
                  <span className="absolute top-1 right-1 text-[#b88a38] text-lg font-serif">⌝</span>
                  <span className="absolute bottom-1 left-1 text-[#b88a38] text-lg font-serif">⌞</span>
                  <span className="absolute bottom-1 right-1 text-[#b88a38] text-lg font-serif">⌟</span>

                  <div className="mt-2 space-y-1">
                    {invite.name && (
                      <p className="font-serif italic text-sm text-[#23422d]">
                        Dear {invite.name},
                      </p>
                    )}
                    <p className="text-[15px] font-sans tracking-[0.25em] text-[#8e7349] uppercase">
                      In The Name of Allah, The Most Gracious, The Most Merciful
                    </p>
                    <p className="text-[11px] font-sans tracking-[0.2em] text-[#735d39] uppercase font-medium pt-1">
                      Together With Their Families
                    </p>
                  </div>

                  <div className="mt-5 space-y-2">
                    <h1 className="font-script text-[25px] text-[#183523] leading-tight drop-shadow-sm">
                      Mr. <span className="text-[#b88a38] font-normal">&amp;</span> Mrs.   <br /><span className="font-alex text-[40px]">Muhammad Anwar</span>
                    </h1>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[14px] font-sans tracking-[0.3em] text-[#8e7349] uppercase">
                      Request The Pleasure Of Your Company
                    </p>
                    <h1 className="font-script text-[55px]  text-[#183523] leading-tight drop-shadow-sm">
                      Rida  <span className="text-[#b88a38] font-normal  text-[35px]">with</span>  Usman
                    </h1>
                    <div className="flex items-center justify-center gap-3 text-[#b88a38] text-xs py-1">
                      <span>✦</span>
                      <span className="h-[1px] w-12 bg-[#cba354]/60" />
                      <span className="font-sans text-[11px] tracking-[0.25em] text-[#6d552f] uppercase font-semibold">
                        December 2026
                      </span>
                      <span className="h-[1px] w-12 bg-[#cba354]/60" />
                      <span>✦</span>
                    </div>
                  </div>

                  <div className="mb-2 w-full max-w-[280px] space-y-2">
                    <button
                      onClick={goNext}
                      className="w-full py-3 px-6 rounded-md bg-[#183523] text-[#fbf5e8] font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#0f2417] transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group border border-[#cba354]/50"
                    >
                      <span>BEGIN EXPERIENCE</span>
                      <ChevronDown className="w-4 h-4 text-[#ecd089] group-hover:translate-y-0.5 transition-transform" />
                    </button>
                    <p className="text-[11px] font-serif italic text-[#8c7450]">
                      Swipe or tap to turn page
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* HOLY UNION */}
            {page === "union" && (
              <motion.div
                key="page-union"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 p-6 sm:p-8 flex flex-col items-center justify-between text-center bg-gradient-to-b from-[#fffbf4] to-[#f5ebda] overflow-y-auto"
              >
                <div className="text-2xl text-[#b88a38]"></div>

                <div className="space-y-4 max-w-[320px]">
                  <p className="text-[15px] font-sans tracking-[0.25em] text-[#8e7349] uppercase">
                    The Holy Union
                  </p>
                  <p className="font-serif italic text-base text-[20px] text-[#23422d] leading-relaxed border-y border-[#d8c5a2]/60 py-3">
                    &ldquo;And among His Signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.&rdquo;
                    <span className="block mt-1 text-[11px] font-sans uppercase tracking-widest text-[#8a6e3e]">
                      — Surah Ar-Rum 30:21
                    </span>
                  </p>

                  <h2 className="font-script text-4xl sm:text-5xl text-[#1a3825]">
                    Rida <span className="text-[#b88a38]">&amp;</span> Usman
                  </h2>

                  <p className="text-[20px] font-serif text-[#4d4032] leading-relaxed">
                    With grateful hearts and the blessings of our cherished families, we invite you to stand witness as we exchange vows and celebrate the sacred beginning of our forever.
                  </p>
                </div>

                <div className="w-full max-w-[280px] space-y-2 pt-4">
                  <button
                    onClick={goNext}
                    className="w-full py-2.5 px-6 rounded-md bg-[#183523] text-[#fbf5e8] font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#0f2417] transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{nextLabel}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#ecd089]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* EVENT PAGES: Mehndi / Barat / Walima (only the ones in the link) */}
            {EVENT_KEYS.map(
              (k) =>
                page === k && (
                  <EventPage
                    key={`page-${k}`}
                    event={EVENTS[k]}
                    guests={invite.events[k] ?? null}
                    name={invite.name}
                    direction={direction}
                    variants={pageVariants}
                    nextLabel={nextLabel}
                    onNext={goNext}
                  />
                )
            )}

            {/* SURPRISE */}
            {page === "surprise" && (
              <motion.div
                key="page-surprise"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 p-6 sm:p-8 flex flex-col items-center justify-between text-center bg-gradient-to-b from-[#fffbf4] to-[#f6ecdc] overflow-y-auto"
              >
                <div>
                  <p className="text-[10px] font-sans tracking-[0.25em] text-[#8e7349] uppercase">
                    A SPECIAL SURPRISE
                  </p>
                  <h2 className="font-script text-4xl sm:text-5xl text-[#1a3825] mt-1">
                    Scratch to Reveal
                  </h2>
                  <p className="text-xs font-serif text-[#655543] mt-1">
                    A personalized blessing waiting just for you.
                  </p>
                </div>

                <div className="w-full my-auto flex flex-col items-center">
                  <ScratchCard />
                </div>

                <div className="w-full max-w-[280px] space-y-2 pt-2">
                  <button
                    onClick={goNext}
                    className="w-full py-2.5 px-6 rounded-md bg-[#183523] text-[#fbf5e8] font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#0f2417] transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{nextLabel}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#ecd089]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* RSVP */}
            {page === "rsvp" && (
              <motion.div
                key="page-rsvp"
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 p-5 sm:p-7 flex flex-col items-center justify-between text-center bg-gradient-to-b from-[#fffbf4] to-[#f4e9d7] overflow-y-auto"
              >
                <div>
                 
                  <h2 className="font-script text-4xl sm:text-5xl text-[#1a3825] mt-4">
                   Looking Forward:
                  </h2>
                </div>

                {/* Elegant list of names styled like the card */}
                <div className="w-full max-w-[320px] my-auto py-2">
                  {/* Decorative Banner */}
                  {guestNames.length > 0 ? (
                    <ul className="space-y-2.5">
                      {guestNames.map((n, i) => (
                        <li
                          key={`${n}-${i}`}
                          className="font-serif text-[25px]  font-semibold text-[#8b1828] tracking-wide"
                        >
                          {n}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-serif italic text-sm text-[#8c7450]">
                      We look forward to celebrating with you.
                    </p>
                  )}
                </div>

                <div className="w-full max-w-[320px] pt-3 border-t border-[#d8c5a2]/60 flex items-center justify-between">

                  <button
                    type="button"
                    onClick={() => goToPage(0)}
                    className="flex items-center gap-1 text-[11px] font-sans uppercase tracking-wider text-[#8a6e3e] font-semibold hover:text-[#183523] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Floating Navigation Dots & Arrows */}
        <div className="relative z-30 py-2.5 px-4 bg-[#faf5eb]/90 backdrop-blur-sm border-t border-[#e2d2b5] flex items-center justify-between">
          <button
            type="button"
            onClick={() => goToPage(Math.max(currentPage - 1, 0))}
            disabled={currentPage === 0}
            className={`p-1.5 rounded-full text-[#183523] transition-all ${currentPage === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-[#efe1c9] active:scale-95"
              }`}
            aria-label="Previous page"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {pages.map((p, idx) => (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(idx)}
                className={`transition-all duration-300 rounded-full ${currentPage === idx
                  ? "w-5 h-2 bg-[#b88a38]"
                  : "w-2 h-2 bg-[#d6c4a3] hover:bg-[#b88a38]/60"
                  }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={currentPage === totalPages - 1}
            className={`p-1.5 rounded-full text-[#183523] transition-all ${currentPage === totalPages - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-[#efe1c9] active:scale-95"
              }`}
            aria-label="Next page"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}