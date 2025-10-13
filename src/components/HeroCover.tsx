"use client";
import Image from "next/image";
import * as React from "react";

export default function HeroCover({
  src,
  alt = "",
  children,
  className = "",
}: {
  src: string;
  alt?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative w-full min-h-dvh overflow-hidden ${className}`}>
      {/* imagen de fondo */}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* degradado oscuro desde abajo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      {/* texto al frente, en blanco, a 25% del borde inferior */}
      <div className="absolute inset-x-0 bottom-[25%] z-10 px-6">
        {children}
      </div>
    </div>
  );
}
