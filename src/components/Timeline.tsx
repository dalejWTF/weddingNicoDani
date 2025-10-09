// components/Timeline.tsx
"use client";

const HIGHLIGHT = "#77C3EC"; // baby blue (ajústalo si quieres otro tono)
const TEXTTIMELINE = "#7b7c7cff";

import { Lora } from "next/font/google";


const lora = Lora({
    subsets: ["latin"],
    weight: "400",
    style: "italic",
    variable: "--font-lora",
    display: "swap",
});
type Item = { time: string; label: string; side?: "left" | "right" };

export default function Timeline({
  items,
  title,
  className,
}: {
  items: Item[];
  title?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      {title && (
        
        <div
          className={`mb-2 text-center text-sm font-medium text-4xl sm:text-5xl tracking-wide ${lora.className}`}
          style={{ color: TEXTTIMELINE }}
        >
          {title}
        </div>
      )}

      {/* Contenedor ajustado al contenido */}
      <div className="relative mx-auto w-fit px-2">
        {/* Línea vertical central (≥ sm) */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 sm:block"
          style={{ backgroundColor: HIGHLIGHT }}
        />

        {/* DESKTOP/TABLET: zig-zag */}
        <ol className="hidden sm:grid sm:grid-cols-[max-content_1px_max-content] sm:auto-rows-[60px] sm:gap-y-6">
          {items.map((it, i) => {
            const side: "left" | "right" = it.side ?? (i % 2 === 0 ? "left" : "right");
            return (
              <li key={i} className="contents">
                {/* Celda izquierda */}
                <div className="relative flex items-center justify-end pr-5">
                  {side === "left" ? (
                    <>
                      {/* Conector */}
                      <span
                        className="absolute right-0 top-1/2 h-px w-10"
                        style={{ backgroundColor: HIGHLIGHT }}
                      />
                      <ItemBox time={it.time} label={it.label} align="right" color={HIGHLIGHT} />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>

                {/* Punto en la línea */}
                <div className="relative">
                  <span
                    className="absolute left-1/2 top-1/2 z-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: HIGHLIGHT }}
                  />
                </div>

                {/* Celda derecha */}
                <div className="relative flex items-center justify-start pl-5">
                  {side === "right" ? (
                    <>
                      <span
                        className="absolute left-0 top-1/2 h-px w-10"
                        style={{ backgroundColor: HIGHLIGHT }}
                      />
                      <ItemBox time={it.time} label={it.label} align="left" color={HIGHLIGHT} />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* MÓVIL: columna con línea a la izquierda */}
        <ol
          className="relative pl-5 sm:hidden"
          style={{ borderLeft: `1px solid ${HIGHLIGHT}` }}
        >
          {items.map((it, i) => (
            <li key={i} className="relative py-3">
              <span
                className="absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: HIGHLIGHT }}
              />
              <div className="ml-3">
                <ItemBox time={it.time} label={it.label} align="left" color={HIGHLIGHT} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ItemBox({
  time,
  label,
  align,
  color,
}: {
  time: string;
  label: string;
  align: "left" | "right";
  color: string;
}) {
  return (
    <div className={`w-[220px] leading-tight ${align === "left" ? "text-left" : "text-right"}`}>
      <div
        className="text-[13px] font-extrabold uppercase tracking-wide"
        style={{ color }}
      >
        {time}
      </div>
      <div
        className="text-[11px] uppercase tracking-wide"
        style={{ color: TEXTTIMELINE }}
      >
        {label}
      </div>
    </div>
  );
}
