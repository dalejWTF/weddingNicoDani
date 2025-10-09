// components/Envelope.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

type Props = { href: string };

/**
 * Sobre cerrado con ligera animación. Al clic navega a `href`.
 * Construido con triángulos CSS (bordes) y framer-motion para el flap.
 */
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
        <div className="absolute inset-0 rounded-2xl shadow-2xl bg-gradient-to-br from-rose-100 via-rose-50 to-amber-50" />

        {/* Pliegues laterales */}
        <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[120px] sm:border-t-[140px] border-r-[160px] sm:border-r-[190px] border-t-rose-200/80 border-r-transparent" />
        <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[120px] sm:border-t-[140px] border-l-[160px] sm:border-l-[190px] border-t-rose-200/80 border-l-transparent" />

        {/* Solapa superior (flap) animada */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-b-[140px] sm:border-b-[160px] border-l-[160px] sm:border-l-[190px] border-r-[160px] sm:border-r-[190px] border-b-rose-300 border-l-transparent border-r-transparent rounded-t-2xl"
          style={{ transformStyle: "preserve-3d", transformOrigin: "top center" }}
          whileHover={{ rotateX: -22 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        />

        {/* Cuerpo (cierre inferior) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-t-[110px] sm:border-t-[130px] border-l-[160px] sm:border-l-[190px] border-r-[160px] sm:border-r-[190px] border-t-rose-100 border-l-transparent border-r-transparent" />

        {/* Sello de cera */}
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center size-16 sm:size-18 rounded-full bg-rose-500 shadow-lg ring-4 ring-rose-400/40"
        >
          <Heart className="size-7 text-rose-50" />
        </motion.div>

        {/* Indicador accesible */}
        <div className="absolute -bottom-8 w-full text-center text-xs text-neutral-500 select-none opacity-90">
          Abrir invitación
        </div>
      </motion.div>
    </Link>
  );
}