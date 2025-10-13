// components/Timeline.tsx
"use client";

const HIGHLIGHT = "#77C3EC";
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
          className={`mb-2 text-center text-4xl sm:text-5xl tracking-wide ${lora.className}`}
          style={{ color: TEXTTIMELINE }}
        >
          {title}
        </div>
      )}

      {/* Contenedor responsive con línea central SIEMPRE visible */}
      <div className="relative mx-auto w-full max-w-[920px] px-3">
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
          style={{ backgroundColor: HIGHLIGHT }}
        />

        {/* Zig-zag en todas las resoluciones */}
        <ol className="grid grid-cols-[max-content_1px_max-content] auto-rows-[40px] gap-y-3 justify-center">
          {items.map((it, i) => {
            const side: "left" | "right" = it.side ?? (i % 2 === 0 ? "left" : "right");
            return (
              <li key={i} className="contents">
                {/* Celda izquierda */}
                <div className="relative flex items-center justify-end pr-3 sm:pr-5">
                  {side === "left" ? (
                    <>
                      <span
                        className="absolute right-0 top-1/2 h-px w-8 sm:w-10"
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
                <div className="relative flex items-center justify-start pl-3 sm:pl-5">
                  {side === "right" ? (
                    <>
                      <span
                        className="absolute left-0 top-1/2 h-px w-8 sm:w-10"
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
    <div
      className={`w-[clamp(140px,40vw,220px)] leading-tight ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      <div className="text-[13px] font-extrabold uppercase tracking-wide" style={{ color }}>
        {time}
      </div>
      <div className="text-[11px] uppercase tracking-wide" style={{ color: TEXTTIMELINE }}>
        {label}
      </div>
    </div>
  );
}
