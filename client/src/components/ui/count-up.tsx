import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

interface CountUpProps {
  value: number;
  /** Formats the in-flight value, e.g. add "%" or format as duration. */
  format?: (v: number) => string;
  duration?: number;
  className?: string;
}

/** Animates a number from 0 to `value` when it scrolls into view. */
export function CountUp({ value, format, duration = 1.1, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const fmt = useRef(format);
  fmt.current = format;

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduceMotion) {
      el.textContent = fmt.current ? fmt.current(value) : String(Math.round(value));
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = fmt.current ? fmt.current(v) : String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, inView, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {format ? format(0) : "0"}
    </span>
  );
}
