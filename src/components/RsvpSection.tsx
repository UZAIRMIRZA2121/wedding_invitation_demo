"use client";

import React, { useState } from "react";
import { triggerConfetti } from "@/lib/confetti";
import { Check, Heart, Send, Users, MessageSquareHeart } from "lucide-react";

interface Wish {
  name: string;
  wishes: string;
  time: string;
}

export default function RsvpSection() {
  const [attending, setAttending] = useState<"yes" | "no" | null>("yes");
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("2");
  const [note, setNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wishesList, setWishesList] = useState<Wish[]>([
    {
      name: "Hamza & Family",
      wishes: "Heartiest congratulations Rida  and Usman ! May Allah bless your new journey with endless love and happiness.",
      time: "Just now",
    },
    {
      name: "Dr. Ayesha Malik",
      wishes: "Wishing you both a lifetime of togetherness, peace, and beautiful moments. Looking forward to the celebration!",
      time: "2h ago",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (attending === "yes") {
      triggerConfetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#244632", "#fff", "#f2c94c"],
      });
    }

    if (note.trim()) {
      setWishesList((prev) => [
        {
          name: name.trim(),
          wishes: note.trim(),
          time: "Just now",
        },
        ...prev,
      ]);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-[340px] mx-auto text-left">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Attending Toggle */}
          <div className="flex gap-2 p-1 rounded-lg bg-[#efe6d3] border border-[#d6c4a3]">
            <button
              type="button"
              onClick={() => setAttending("yes")}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-serif font-medium transition-all duration-300 text-center ${attending === "yes"
                ? "bg-[#1f3d2a] text-[#fff6e3] shadow-sm font-semibold"
                : "text-[#4d4032] hover:text-[#1f3d2a]"
                }`}
            >
              Joyfully Accepts ✓
            </button>
            <button
              type="button"
              onClick={() => setAttending("no")}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-serif font-medium transition-all duration-300 text-center ${attending === "no"
                ? "bg-[#6d5b4a] text-[#fff6e3] shadow-sm font-semibold"
                : "text-[#4d4032] hover:text-[#1f3d2a]"
                }`}
            >
              Regretfully Declines
            </button>
          </div>

          {/* Guest Name */}
          <div>
            <label className="block text-[10px] font-sans tracking-widest text-[#7a643f] uppercase mb-1">
              Your Full Name(s) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g.  & Family"
              className="w-full px-3 py-1.5 text-xs font-serif rounded-md bg-white/90 border border-[#cba354]/50 focus:outline-none focus:ring-1 focus:ring-[#1f3d2a] text-[#2b231a]"
            />
          </div>

          {/* Guest Count */}
          {attending === "yes" && (
            <div>
              <label className="block text-[10px] font-sans tracking-widest text-[#7a643f] uppercase mb-1 flex items-center justify-between">
                <span>Number of Guests</span>
                <span className="flex items-center gap-1 text-[#1f3d2a]">
                  <Users className="w-3 h-3" /> {guests}
                </span>
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-serif rounded-md bg-white/90 border border-[#cba354]/50 focus:outline-none focus:ring-1 focus:ring-[#1f3d2a] text-[#2b231a]"
              >
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4 Persons</option>
                <option value="5+">5+ Family Members</option>
              </select>
            </div>
          )}

          {/* Warm Note / Dua */}
          <div>
            <label className="block text-[10px] font-sans tracking-widest text-[#7a643f] uppercase mb-1">
              Blessings & Warm Wishes
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Leave a prayer or loving message for the couple..."
              className="w-full px-3 py-1.5 text-xs font-serif rounded-md bg-white/90 border border-[#cba354]/50 focus:outline-none focus:ring-1 focus:ring-[#1f3d2a] text-[#2b231a] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-md bg-[#1f3d2a] text-[#fbf5e8] text-xs font-sans tracking-widest uppercase font-semibold hover:bg-[#14281b] transition-all duration-300 shadow-md flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm RSVP & Send Wishes</span>
          </button>
        </form>
      ) : (
        <div className="p-4 rounded-xl border border-[#cba354]/60 bg-[#fffdf8] shadow-sm text-center animate-fade-in space-y-2">
          <div className="w-9 h-9 rounded-full bg-[#1f3d2a]/10 text-[#1f3d2a] mx-auto flex items-center justify-center">
            <Check className="w-5 h-5 text-[#1f3d2a]" />
          </div>
          <h4 className="font-serif text-lg text-[#1f3d2a] font-semibold">
            Thank You, {name}!
          </h4>
          <p className="text-xs text-[#554738] font-serif leading-relaxed">
            {attending === "yes"
              ? "Your RSVP has been joyfully received! We cannot wait to celebrate with you."
              : "Thank you for letting us know. You will be dearly missed in our celebrations."}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-[10px] text-[#9d6f2c] underline font-sans uppercase tracking-wider"
          >
            Update response
          </button>
        </div>
      )}

      {/* Guestbook Preview */}
      <div className="mt-4 pt-3 border-t border-[#d8c5a2]/60">
        <div className="flex items-center gap-1.5 mb-2 text-[#685331]">
          <MessageSquareHeart className="w-3.5 h-3.5 text-[#b88a38]" />
          <span className="text-[10px] font-sans tracking-wider uppercase font-semibold">
            Guestbook & Wishes ({wishesList.length})
          </span>
        </div>
        <div className="max-h-28 overflow-y-auto space-y-2 pr-1">
          {wishesList.map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-white/70 border border-[#e6d8c0] text-[11px] font-serif"
            >
              <div className="flex items-center justify-between text-[#8a6e3e] font-sans text-[9px] mb-0.5">
                <span className="font-semibold text-[#1f3d2a]">{item.name}</span>
                <span>{item.time}</span>
              </div>
              <p className="text-[#3c3226] italic">&ldquo;{item.wishes}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
