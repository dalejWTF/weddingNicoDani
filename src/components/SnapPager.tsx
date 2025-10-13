// components/SnapPager.tsx
"use client";
import * as React from "react";
import { motion, Variants } from "framer-motion";

type Dir = 1 | -1;

export default function SnapPager({
  children,
  pageSize = 2,
  gap = "1rem",
  duration = 0.85,   // ← más grande = más “lento”
  offset = 24,       // ← distancia del slide (px) según dirección
}: {
  children: React.ReactNode;
  pageSize?: number;
  gap?: string;
  duration?: number;
  offset?: number;
}) {
  const items = React.Children.toArray(children);
  const pages: React.ReactNode[][] = [];
  for (let i = 0; i < items.length; i += pageSize) pages.push(items.slice(i, i + pageSize));

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [dir, setDir] = React.useState<Dir>(1); // 1 = baja; -1 = sube

  // Detecta dirección de desplazamiento dentro del contenedor con snap
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let last = el.scrollTop;
    let ticking = false;

    const onScroll = () => {
      const st = el.scrollTop;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setDir(st > last ? 1 : -1);
          last = st;
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Variants para la sección (controla stagger de los hijos)
  const pageVariants: Variants = {
    hidden: {},
    enter: {
      transition: { when: "beforeChildren", staggerChildren: 0.12 },
    },
  };

  // Variants para cada hijo (fade + slide según dirección)
  const itemVariants: Variants = {
    hidden: (d: Dir) => ({
      opacity: 0,
      y: d === 1 ? offset : -offset,
    }),
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1], // easeOutExpo-ish
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="isolate relative h-dvh w-full max-w-[100dvw] overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth"
      style={{ overscrollBehaviorY: "contain" }}
    >
      {pages.map((page, idx) => (
        <motion.section
          key={idx}
          className="snap-start min-h-dvh grid content-center justify-items-stretch px-3 w-full max-w-[100dvw] overflow-x-clip"
          style={{ gap, scrollSnapStop: "always" }}
          variants={pageVariants}
          initial="hidden"
          whileInView="enter"
          viewport={{ amount: 1, once: false }}   // vuelve a animar cada vez que entra el slide
          custom={dir}                                // pasa la dirección a los hijos
        >
          {page.map((child, j) => (
            <motion.div
              key={j}
              variants={itemVariants}
              custom={dir}
              className="w-full max-w-screen-sm mx-auto min-w-0"
            >
              {child}
            </motion.div>
          ))}
        </motion.section>
      ))}
    </div>
  );
}
