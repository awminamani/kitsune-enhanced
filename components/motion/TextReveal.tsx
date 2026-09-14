// components/motion/TextReveal.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

/** Word-by-word masked reveal. */
export function TextReveal({ text, className = "", delay = 0, stagger = 0.04 }: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: "0.25em" }}
        >
          <span
            className="inline-block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(110%)",
              transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}s`,
              willChange: "transform, opacity",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
