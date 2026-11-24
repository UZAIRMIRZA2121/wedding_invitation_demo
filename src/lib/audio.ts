import { useSyncExternalStore } from "react";

const SRC = "/bismillah-whats-app-status.mp3";

let audio: HTMLAudioElement | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio(SRC);
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = "auto";
    audio.addEventListener("play", emit);
    audio.addEventListener("pause", emit);
  }
  return audio;
}

export async function playMusic() {
  const a = getAudio();
  if (!a || !a.paused) return;
  try {
    await a.play();
  } catch (error) {
    console.error("Audio playback failed:", error);
  }
}

export function pauseMusic() {
  getAudio()?.pause();
}

export function toggleMusic() {
  const a = getAudio();
  if (!a) return;
  if (a.paused) playMusic();
  else pauseMusic();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIsPlaying() {
  return useSyncExternalStore(
    subscribe,
    () => !!audio && !audio.paused,
    () => false
  );
}