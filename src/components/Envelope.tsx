// components/Envelope.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// Paleta baby blue sutil para el sobre
const BASE_FROM = "#F7FBFE";
const BASE_TO = "#EFF6FC";
const EDGE = "#DDEAF6";
const SEAL = "#B4D7EA";

type Props = { href: string };

export default function Envelope({ href }: Props) {
  return (
    <Link href={href} aria-label="Abrir invitación" className="group block">
      <motion.div
        initial={{ y: 0, rotate: -1 }}
        whileHover={{ y: -4, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-[320px] h-[220px] sm:w-[380px] sm:h-[260px]"
        style={{ perspective: 1000 }}
      >
        {/* Base del sobre */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${BASE_FROM}, ${BASE_TO})`,
            border: `1px solid ${EDGE}`,
          }}
        />

        {/* Pliegues laterales */}
        <div
          className="absolute bottom-0 left-0 w-0 h-0"
          style={{
            borderTop: "120px solid rgba(221,234,246,0.8)",
            borderRight: "160px solid transparent",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-0 h-0"
          style={{
            borderTop: "120px solid rgba(221,234,246,0.8)",
            borderLeft: "160px solid transparent",
          }}
        />

        {/* Solapa superior */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 rounded-t-2xl"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "top center",
            borderBottom: "140px solid #E6F2FB",
            borderLeft: "160px solid transparent",
            borderRight: "160px solid transparent",
          }}
          whileHover={{ rotateX: -22 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        />

        {/* Cierre inferior */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderTop: "110px solid #F2F8FD",
            borderLeft: "160px solid transparent",
            borderRight: "160px solid transparent",
          }}
        />

        {/* Sello */}
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center size-16 sm:size-18 rounded-full shadow-lg"
          style={{ backgroundColor: SEAL, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
        >
          <Heart className="size-7" style={{ color: "#FFFFFF" }} />
        </motion.div>

        <div className="absolute -bottom-8 w-full text-center text-xs text-slate-500 select-none opacity-90">
          Abrir invitación
        </div>
      </motion.div>
    </Link>
  );
}
