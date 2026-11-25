"use client";

import React, { useState, useEffect } from "react";

// Target: 11 December 2026, 19:00:00 PKT (change the time if needed)
const TARGET_DATE = new Date("2026-12-11T19:00:00+05:00").getTime();

export default function Countdown({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });



  useEffect(() => {
    const targetDate = new Date(target).getTime();
    const updateCountdown = () => {
      const difference = targetDate - Date.now();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 w-full max-w-[340px] my-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl border border-[#cba354]/50 bg-gradient-to-b from-[#fffbf4] to-[#f4ebd9] shadow-sm"
        >
          <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#183222] tracking-tight">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-widest text-[#9d6f2c] uppercase mt-0.5">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}