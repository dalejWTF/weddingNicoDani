// components/SnapPager.tsx
"use client";
import * as React from "react";
import { motion } from "framer-motion";

export default function SnapPager({ children, pageSize = 2, gap = "1rem" }:{
  children: React.ReactNode; pageSize?: number; gap?: string;
}) {
  const items = React.Children.toArray(children);
  const pages: React.ReactNode[][] = [];
  for (let i = 0; i < items.length; i += pageSize) pages.push(items.slice(i, i + pageSize));

  return (
    <div
      className="isolate relative h-dvh w-full max-w-[100dvw] overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth"
      style={{ overscrollBehaviorY: "contain" }}
    >
      {pages.map((page, idx) => (
        <section
          key={idx}
          className="snap-start min-h-dvh grid content-center justify-items-stretch px-3 w-full max-w-[100dvw] overflow-x-clip"
          style={{ gap }}
        >
          {page.map((child, j) => (
            <motion.div
              key={j}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full max-w-screen-sm mx-auto min-w-0"
            >
              {child}
            </motion.div>
          ))}
        </section>
      ))}
    </div>
  );
}
