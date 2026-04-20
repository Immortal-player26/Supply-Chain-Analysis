import { useState, useEffect, useRef, useCallback } from "react";

/** Returns a 0→1 progress value representing how far the element has scrolled through the viewport. */
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;
          // 0 when top enters viewport bottom, 1 when bottom exits viewport top
          const raw = 1 - rect.top / vh;
          setProgress(Math.max(0, Math.min(1, raw)));
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);

  return progress;
}

/** Global normalized scroll position (0→1 over entire document). */
export function useGlobalScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          setScrollY(y);
          setScrollRatio(maxScroll > 0 ? y / maxScroll : 0);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { scrollY, scrollRatio };
}

/** Intersection Observer hook – returns true when element is visible. */
export function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // animate once
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return inView;
}
