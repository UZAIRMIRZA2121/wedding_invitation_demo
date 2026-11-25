"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Calendar, Clock, MapPin, CalendarPlus, ChevronDown, Users } from "lucide-react";
import Countdown from "@/components/Countdown";
import { EventInfo, Guests, guestText } from "@/lib/events";

interface Props {
  event: EventInfo;
  guests: Guests;
  name?: string;
  direction: number;
  variants: Variants;
  nextLabel: string;
  onNext: () => void;
}

export default function EventPage({ event, guests, name, direction, variants, nextLabel, onNext }: Props) {
  const guestLine = guestText(guests);

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Rida & Usman Wedding//EN",
      "BEGIN:VEVENT",
      `DTSTART:${event.icsStart}`,
      `DTEND:${event.icsEnd}`,
      `SUMMARY:Rida & Usman - ${event.title.replace("The ", "")}`,
      `LOCATION:${event.venue}, ${event.address}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `rida-usman-${event.key}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 px-4 py-3 sm:p-6 flex flex-col items-center justify-between text-center bg-gradient-to-b from-[#fffbf4] to-[#f4e9d7] overflow-hidden scrollbar-none"
    >
      {/* Background Image with subtle breathing pulse for Mehndi */}
      {event.key === "mehndi" && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.18, 0.35, 0.18] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 pointer-events-none bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/mehndibackground.jpeg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fffbf4]/85 via-[#faf3e3]/75 to-[#f4e9d7]/85 pointer-events-none z-0" />
        </>
      )}

      {/* Top Header */}
      <div className="relative z-10 pt-1 shrink-0">
        <p className="text-[13px] sm:text-[15px] font-sans tracking-[0.25em] text-[#8e7349] uppercase font-semibold">{event.eyebrow}</p>
        <h2 className="font-script text-5xl sm:text-6xl text-[#1a3825] leading-tight mt-0.5">{event.title}</h2>
        {(name || guestLine) && (
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[#cba354]/60 bg-white/80 px-3.5 py-0.5 text-lg sm:text-xl font-serif text-[#4d4032] shadow-sm">
            <Users className="w-4 h-4 text-[#b88a38]" />
            <span className="font-medium">{[name, guestLine].filter(Boolean).join(" · ")}</span>
          </div>
        )}
      </div>

      {/* Middle Scrollable/Sliding Content Container */}
      <div className="w-full flex-1 min-h-0 overflow-y-auto my-1.5 px-1 flex flex-col items-center space-y-3 relative z-10 scrollbar-thin">
        <div className="flex flex-col items-center w-full shrink-0">
          <span className="text-[12px] sm:text-[13px] font-sans tracking-widest text-[#8a6e3e] uppercase font-semibold mb-0.5">
            COUNTDOWN TO THE CELEBRATION
          </span>
          <Countdown target={event.target} />
        </div>

        <div className="w-full max-w-[340px] space-y-2.5 text-left shrink-0">
          {[
            { Icon: Calendar, label: "DATE", main: event.dayText },
            { Icon: Clock, label: "TIME", main: event.timeText },
          ].map(({ Icon, label, main }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-[#d8c5a2]/80 shadow-sm">
              <div className="p-2.5 rounded-lg bg-[#1a3825] text-[#ecd089]"><Icon className="w-5 h-5" /></div>
              <div>
                <span className="block text-[12px] font-sans tracking-widest text-[#8a6e3e] uppercase font-bold">{label}</span>
                <strong className="font-sans text-[16px] sm:text-[17px] font-bold text-[#1b3424] leading-snug">{main}</strong>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-[#d8c5a2]/80 shadow-sm">
            <div className="p-2.5 rounded-lg bg-[#1a3825] text-[#ecd089]"><MapPin className="w-5 h-5" /></div>
            <div>
              <span className="block text-[12px] font-sans tracking-widest text-[#8a6e3e] uppercase font-bold">VENUE</span>
              <strong className="font-sans text-[16px] sm:text-[17px] font-bold text-[#1b3424] block leading-snug">{event.venue}</strong>
              <span className="text-[13px] sm:text-[14px] font-sans text-[#5c4a35] font-medium leading-relaxed block mt-0.5">{event.address}</span>
            </div>
          </div>

          {/* Mehndi special "Awaiting" badge and list of names */}
          {event.key === "mehndi" && (
            <div className="mt-2.5 p-4 rounded-xl bg-gradient-to-b from-[#fffaf1] to-[#fbf2e0] border-2 border-[#d4af37]/80 shadow-md text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="h-[1px] w-6 bg-[#b88a38]/60" />
                <h3 className="font-alex text-3xl sm:text-4xl text-[#7a121d] font-normal">
                  Awaiting:
                </h3>
                <span className="h-[1px] w-6 bg-[#b88a38]/60" />
              </div>

              <p className="font-serif text-[18px] sm:text-[20px] font-bold text-[#7a121d] tracking-wide leading-snug">
                HIRA, KHADIJA,<br />
                ZAINAB SHAHZADI,<br />
                FAJAR, IRSA,<br />
                IZZA NOOR
              </p>

              <div className="flex items-center justify-center gap-1.5 my-2 text-[#b88a38]">
                <span className="h-[1px] w-10 bg-[#cba354]/60" />
                <span className="text-[12px] text-[#7a121d]">♥</span>
                <span className="h-[1px] w-10 bg-[#cba354]/60" />
              </div>

              <p className="font-serif text-[15px] sm:text-[16px] text-[#6d4c1b] italic font-bold">
                All Family Members &amp; Friends
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions Pin to Bottom */}
      <div className="w-full max-w-[320px] space-y-2 pt-2 pb-1 relative z-10 shrink-0">
        <button
          onClick={downloadIcs}
          className="w-full py-3 px-4 rounded-lg border border-[#cba354] bg-[#fffaf0] text-[#1b3424] font-sans text-[13px] tracking-wider uppercase font-bold hover:bg-[#f1e5cc] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
        >
          <CalendarPlus className="w-4 h-4 text-[#b88a38]" />
          <span>Add to My Calendar</span>
        </button>
        <button
          onClick={onNext}
          className="w-full py-3 px-4 rounded-lg bg-[#183523] text-[#fbf5e8] font-sans text-[13px] tracking-[0.2em] uppercase font-bold hover:bg-[#0f2417] transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
        >
          <span>{nextLabel}</span>
          <ChevronDown className="w-4 h-4 text-[#ecd089]" />
        </button>
      </div>
    </motion.div>
  );
}