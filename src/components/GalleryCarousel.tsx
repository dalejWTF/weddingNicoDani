// components/GalleryCarousel.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
// 👇 añade DialogTitle
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from "@/components/ui/dialog";

type Img = { src: StaticImageData | string; alt?: string };

export default function GalleryCarousel({
  images,
  aspect = 16 / 10,
}: {
  images: Img[];
  aspect?: number;
}) {
  const [[index, direction], setIndex] = React.useState<[number, 1 | -1]>([0, 1]);
  const [open, setOpen] = React.useState(false);
  const count = images.length;

  function paginate(dir: 1 | -1) {
    setIndex(([i]) => [((i + dir + count) % count), dir]);
  }

  const touch = React.useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) { touch.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 40) paginate(dx < 0 ? 1 : -1);
    touch.current = null;
  }

  const current = images[index];

  return (
    <div className="relative w-full max-w-full overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* marco con alto fijo */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: aspect }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Image
              src={current.src}
              alt={current.alt ?? `Foto ${index + 1}`}
              fill
              sizes="100dvw"
              priority={index === 0}
              className="object-cover select-none"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* controles */}
      <button
        type="button"
        aria-label="Anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-white/80 p-2 shadow"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-white/80 p-2 shadow"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="size-5" />
      </button>

      {/* lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Ampliar imagen"
            className="absolute right-2 top-2 grid place-items-center rounded-full bg-white/90 p-2 shadow"
          >
            <Maximize2 className="size-4" />
          </button>
        </DialogTrigger>

        <DialogContent className="p-0 bg-black/95 border-none w-[min(1100px,100dvw-24px)] rounded-2xl">
          {/* ✅ Título obligatorio para a11y (oculto visualmente) */}
          <DialogTitle className="sr-only">
            Imagen {index + 1} de {count}
          </DialogTitle>

          <DialogClose asChild>
            <button
              className="absolute right-3 top-3 text-white/80 hover:text-white rounded-full p-1"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          </DialogClose>

          <div className="grid place-items-center max-h-[86dvh]">
            <Image
              src={current.src}
              alt={current.alt ?? ""}
              width={2000}
              height={2000}
              className="w-auto h-auto max-w-[96dvw] max-h-[86dvh] object-contain select-none"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* indicadores (restauro posición y evito capturar toques) */}
      <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-5 rounded-full ${i === index ? "bg-rose-500" : "bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}
