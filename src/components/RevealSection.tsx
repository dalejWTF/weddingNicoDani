// components/RevealSection.tsx
"use client";

import { motion } from "framer-motion";

export default function RevealSection({ children, className, delay = 30 }: { children: React.ReactNode; className?: string; delay?: number; }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 10, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 50, ease: "easeOut", delay }}
    >
      {children}
    </motion.section>
  );
}