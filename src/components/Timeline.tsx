// components/Timeline.tsx
"use client";

import Image from "next/image";
import { Lora } from "next/font/google";

const HIGHLIGHT = "#A7CDE6";
const TEXTTIMELINE = "#7B7C7C";

const lora = Lora({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-lora",
  display: "swap",
});

type Item = {
  time: string;
  label: string;
  side?: "left" | "right";
  icon?: string; // ej: "/assets/church.svg"
};

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
        <div className="mb-4 sm:mb-6 text-center">
          <div
            className={`mb-2 tracking-wide ${lora.className}`}
            style={{ color: TEXTTIMELINE, fontSize: "clamp(28px, 6vw, 54px)", lineHeight: 1.06 }}
          >
            {title}
          </div>
          <TitleOrnament color={HIGHLIGHT} />
        </div>
      )}

      <div className="relative mx-auto w-full max-w-[1280px] px-2 sm:px-3">
        {/* Línea vertical central */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
          style={{ backgroundColor: HIGHLIGHT }}
        />

        {/* MISMO LAYOUT EN MÓVIL: dos lados, pero todo escala */}
        <ol
          className="
            grid
            grid-cols-[minmax(120px,40vw)_1px_minmax(120px,40vw)]
            sm:grid-cols-[max-content_1px_max-content]
            auto-rows-[minmax(50px,auto)]
            gap-y-3 sm:gap-y-5
            justify-center
          "
        >
          {items.map((it, i) => {
            const side: "left" | "right" = it.side ?? (i % 2 === 0 ? "left" : "right");
            return (
              <li key={i} className="contents">
                {/* Columna izquierda */}
                <div className="relative flex items-center justify-end pr-3 sm:pr-6">
                  {side === "left" ? (
                    <>
                      <span
                        className="absolute right-0 top-1/2 h-px"
                        style={{
                          backgroundColor: HIGHLIGHT,
                          width: "clamp(28px, 12vw, 88px)",
                        }}
                      />
                      <ItemBox
                        time={it.time}
                        label={it.label}
                        align="right"
                        color={HIGHLIGHT}
                        icon={it.icon}
                      />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>

                {/* Punto central */}
                <div className="relative">
                  <span
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      backgroundColor: HIGHLIGHT,
                      width: "clamp(8px, 1.8vw, 10px)",
                      height: "clamp(8px, 1.8vw, 10px)",
                      display: "block",
                    }}
                  />
                </div>

                {/* Columna derecha */}
                <div className="relative flex items-center justify-start pl-3 sm:pl-6">
                  {side === "right" ? (
                    <>
                      <span
                        className="absolute left-0 top-1/2 h-px"
                        style={{
                          backgroundColor: HIGHLIGHT,
                          width: "clamp(28px, 12vw, 88px)",
                        }}
                      />
                      <ItemBox
                        time={it.time}
                        label={it.label}
                        align="left"
                        color={HIGHLIGHT}
                        icon={it.icon}
                      />
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
  icon,
}: {
  time: string;
  label: string;
  align: "left" | "right";
  color: string;
  icon?: string;
}) {
  const rowDir = align === "left" ? "flex-row" : "flex-row-reverse";

  // Ocupa todo el track lateral (fluido). En desktop limitamos un poco más.
  const widthClass =
    "w-[min(40vw,260px)] xs:w-[min(42vw,260px)] sm:w-[clamp(200px,34vw,260px)]";

  const iconSize = "clamp(36px, 10vw, 72px)";
  const timeSize = "clamp(14px, 3.8vw, 18px)";
  const labelSize = "clamp(12px, 3.2vw, 15px)";

  return (
    <div className={`${widthClass} leading-tight ${align === "left" ? "text-left" : "text-right"}`}>
      <div className={`flex ${rowDir} items-center justify-between gap-2`}>
        {/* Texto */}
        <div>
          <div
            className="font-extrabold uppercase tracking-wide"
            style={{ color, fontSize: timeSize }}
          >
            {time}
          </div>
          <div
            className="uppercase tracking-wide"
            style={{ color: TEXTTIMELINE, fontSize: labelSize }}
          >
            {label}
          </div>
        </div>

        {/* Icono (escala fluida) */}
        {icon && (
          <Image
            src={icon}
            width={72}
            height={72}
            alt=""
            aria-hidden
            className="shrink-0"
            style={{ width: iconSize, height: iconSize }}
            priority={false}
          />
        )}
      </div>
    </div>
  );
}

/* Adorno bajo el título */
function TitleOrnament({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      className="mx-auto block h-8 w-[min(70vw,18rem)]"
      viewBox="0 0 260 36"
      fill="none"
    >
      <g opacity="0.9" stroke={color} strokeWidth="1.4">
        <path d="M6 18 Q 44 6, 82 18" />
        <path d="M254 18 Q 216 6, 178 18" />
        <circle cx="130" cy="18" r="3" fill={color} />
        <path d="M98 18 Q 130 30, 162 18" />
      </g>
    </svg>
  );
}
