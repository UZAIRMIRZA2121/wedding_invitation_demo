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
      className="absolute inset-0 p-6 sm:p-8 flex flex-col items-center justify-between text-center bg-gradient-to-b from-[#fffbf4] to-[#f4e9d7] overflow-y-auto"
    >
      <div>
        <p className="text-[15px] font-sans tracking-[0.25em] text-[#8e7349] uppercase">{event.eyebrow}</p>
        <h2 className="font-script text-4xl sm:text-5xl text-[#1a3825] mt-1">{event.title}</h2>
        {(name || guestLine) && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#cba354]/50 bg-white/70 px-3 py-1 text-[26px] font-serif text-[#4d4032]">
            <Users className="w-3 h-3 text-[#b88a38]" />
            <span>{[name, guestLine].filter(Boolean).join(" · ")}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center w-full">
        <span className="text-[14px] font-sans tracking-widest text-[#8a6e3e] uppercase mb-1">
          COUNTDOWN TO THE CELEBRATION
        </span>
        <Countdown target={event.target} />
      </div>

      <div className="w-full max-w-[320px] space-y-3 text-left">
        {[
          { Icon: Calendar, label: "DATE", main: event.dayText },
          { Icon: Clock, label: "TIME", main: event.timeText },
        ].map(({ Icon, label, main }) => (
          <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-white/70 border border-[#d8c5a2]/70 shadow-sm">
            <div className="p-2 rounded bg-[#1a3825] text-[#ecd089]"><Icon className="w-4 h-4" /></div>
            <div>
              <span className="block text-[9px] font-sans tracking-widest text-[#8a6e3e] uppercase font-semibold">{label}</span>
              <strong className="font-serif text-base text-[#1b3424]">{main}</strong>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/70 border border-[#d8c5a2]/70 shadow-sm">
          <div className="p-2 rounded bg-[#1a3825] text-[#ecd089]"><MapPin className="w-4 h-4" /></div>
          <div>
            <span className="block text-[9px] font-sans tracking-widest text-[#8a6e3e] uppercase font-semibold">VENUE</span>
            <strong className="font-serif text-base text-[#1b3424] block leading-tight">{event.venue}</strong>
            <span className="text-xs font-serif text-[#635443]">{event.address}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[300px] space-y-2 pt-2">
        <button
          onClick={downloadIcs}
          className="w-full py-2.5 px-4 rounded-md border border-[#cba354] bg-[#fffaf0] text-[#1b3424] font-sans text-xs tracking-wider uppercase font-semibold hover:bg-[#f1e5cc] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-[#b88a38]" />
          <span>Add to My Calendar</span>
        </button>
        <button
          onClick={onNext}
          className="w-full py-2.5 px-4 rounded-md bg-[#183523] text-[#fbf5e8] font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#0f2417] transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
        >
          <span>{nextLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#ecd089]" />
        </button>
      </div>
    </motion.div>
  );
}