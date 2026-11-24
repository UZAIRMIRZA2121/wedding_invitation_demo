// Safe client-side confetti trigger
export const triggerConfetti = async (options?: any) => {
  if (typeof window === "undefined") return;
  try {
    const confettiModule = await import("canvas-confetti");
    const confetti = confettiModule.default || confettiModule;
    confetti(options);
  } catch (err) {
    console.warn("Confetti failed to trigger:", err);
  }
};
