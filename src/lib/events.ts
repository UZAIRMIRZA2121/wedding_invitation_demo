export type EventKey = "mehndi" | "barat" | "walima";
export type Guests = number | "family" | null;

export interface EventInfo {
  key: EventKey;
  eyebrow: string;
  title: string;
  dayText: string;
  timeText: string;
  venue: string;
  address: string;
  target: string; // ISO with PKT offset, used by the countdown
  icsStart: string;
  icsEnd: string;
}

export const EVENTS: Record<EventKey, EventInfo> = {
  mehndi: {
    key: "mehndi",
    eyebrow: "YOU ARE INVITED TO",
    title: "Mehndi ",
    dayText: "Wednesday 10 December 2026",
    timeText: "06:00 PM",
    venue: "St # 13 Guldasta Park Razabad",
    address: "Faisalabad, Punjab, Pakistan",
    target: "2026-12-10T18:00:00+05:00",
    icsStart: "20261210T180000",
    icsEnd: "20261210T235900",
  },
  barat: {
    key: "barat",
    eyebrow: "SAVE THE DATE",
    title: "Barat  ",
    dayText: "Friday 11 December 2026",
    timeText: "06:00 PM ",
    venue: "Victoria Marquee",
    address: "Faisalabad, Punjab, Pakistan",
    target: "2026-12-11T19:00:00+05:00",
    icsStart: "20261211T190000",
    icsEnd: "20261211T235900",
  },
  walima: {
    key: "walima",
    eyebrow: "YOU ARE INVITED TO",
    title: "Walima",
    dayText: "Saturday 12 December 2026",
    timeText: "01:00 PM ",
    venue: "St # 14 Ch ABBAS Executive Marquee ",
    address: "Faisalabad, Punjab, Pakistan",
    target: "2026-12-12T13:00:00+05:00",
    icsStart: "20261212T130000",
    icsEnd: "20261212T170000",
  },
};

export const EVENT_KEYS: EventKey[] = ["mehndi", "barat", "walima"];

export interface Invite {
  name?: string;
  events: Partial<Record<EventKey, Guests>>;
}

export function parseInvite(search: string): Invite {
  const params = new URLSearchParams(search);
  const name = params.get("name")?.trim() || undefined;
  const events: Invite["events"] = {};

  for (const key of EVENT_KEYS) {
    if (!params.has(key)) continue;
    const raw = (params.get(key) || "").toLowerCase();
    const num = parseInt(raw, 10);
    events[key] = raw === "family" ? "family" : num > 0 ? num : null;
  }

  // No event in the link = show everything (preview mode)
  if (Object.keys(events).length === 0) {
    for (const key of EVENT_KEYS) events[key] = null;
  }
  return { name, events };
}

export function guestText(g: Guests): string | null {
  if (g === "family") return "With Family";
  if (typeof g === "number") return g === 1 ? "1 Persons" : ` ${g} Persons`;
  return null;
}