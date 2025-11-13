// components/Timeline.tsx
"use client";

import Image from "next/image";
import * as React from "react";

const HIGHLIGHT = "#A7CDE6"; // línea + puntos
const TEXTTIMELINE = "#7B7C7C";
const ICON_PAD = "clamp(6px, 1.6vw, 14px)";

type CSSVarProps<T extends string> = React.CSSProperties & Record<T, string>;

export type Item = {
  time: string;
  label: string;
  side?: "left" | "right"; // ya no se usa pero lo dejamos por compat
  icon?: string;
};

export default function Timeline({
  items = [],
  title,
  className,
  titleClassName,
  itemClassName,
}: {
  items?: Item[];
  title?: string;
  className?: string;
  titleClassName?: string;
  itemClassName?: string;
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const cornerVarStyle: CSSVarProps<"--corner"> = {
    ["--corner"]: "clamp(120px,28vw,220px)",
  };

  return (
    <section className={`relative ${className ?? ""}`} style={cornerVarStyle}>
      {title && (
        <div className="mb-3 text-center relative z-10">
          <div
            className={`mb-1 tracking-wide mt-3 ${titleClassName ?? ""}`}
            style={{
              color: TEXTTIMELINE,
              fontSize: "clamp(28px, 6vw, 54px)",
              lineHeight: 1.06,
            }}
          >
            {title}
          </div>
        </div>
      )}

      {/* Hojas decorativas (si te dan scroll, puedes quitarlas o reducir var(--corner)) */}
      <Image
        src="/blueFlowers.png"
        alt=""
        width={400}
        height={400}
        aria-hidden
        className="
    pointer-events-none select-none absolute z-0
    top-[-25px] left-[-30px]          /* móvil: esquina sup. izq. */
    sm:top-[-45px] sm:left-[-40px]    /* desktop: un pelín más afuera */
  "
        style={{
          width: "var(--corner)",
          height: "auto",
          transform: "rotate(-140deg)",     // si quieres menos inclinado, cambia el ángulo
        }}
        priority={false}
      />


      <div className="relative mx-auto w-full max-w-[980px] px-2 sm:px-3 overflow-hidden">
        {/* línea central */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 z-0"
          style={{ backgroundColor: HIGHLIGHT }}
        />

        {/* items */}
        <ol className="relative z-10 mx-auto max-w-[900px] space-y-3 sm:space-y-5">
          {safeItems.map((it, i) => (
            <TimelineRow
              key={i}
              time={it.time}
              label={it.label}
              icon={it.icon}
              itemClassName={itemClassName}
            />
          ))}
        </ol>

        {safeItems.length === 0 && (
          <div className="sr-only">Sin eventos en el itinerario</div>
        )}
      </div>
    </section>
  );
}

function TimelineRow({
  time,
  label,
  icon,
  itemClassName,
}: {
  time: string;
  label: string;
  icon?: string;
  itemClassName?: string;
}) {
  const iconSize = "clamp(40px, 11vw, 72px)";
  const timeSize = "clamp(14px, 3.4vw, 18px)";
  const labelSize = "clamp(12px, 3vw, 16px)";

  return (
    <li
      className="
        relative
        grid
        grid-cols-[minmax(90px,1fr)_minmax(90px,1fr)]
        sm:grid-cols-[minmax(140px,1fr)_minmax(220px,1fr)]
        items-center
        py-2
      "
    >
      {/* puntito sobre la línea central */}
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10"
        style={{
          backgroundColor: HIGHLIGHT,
          width: "clamp(8px, 1.8vw, 10px)",
          height: "clamp(8px, 1.8vw, 10px)",
          display: "block",
        }}
      />

      {/* izquierda: hora */}
      <div className="flex items-center justify-end pr-3 sm:pr-6">
        <span
          className={`font-semibold tracking-wide ${itemClassName ?? ""}`}
          style={{ color: TEXTTIMELINE, fontSize: timeSize }}
        >
          {time}
        </span>
      </div>

      {/* derecha: SVG arriba y label debajo, ambos CENTRADOS y con ancho fijo */}
      <div className="flex items-center justify-start pl-4 sm:pl-6">
        <div
          className={`
            flex flex-col items-center text-center
            gap-1 sm:gap-2
            ${itemClassName ?? ""}
          `}
          style={{
            width: "min(160px, 40vw)", // ancho fijo → todos los SVG+labels quedan alineados
          }}
        >
          {icon && (
            <div
              className="relative shrink-0"
              style={{ padding: ICON_PAD }}
            >
              <Image
                src={icon}
                width={72}
                height={72}
                alt=""
                aria-hidden
                className="block"
                style={{ width: iconSize, height: iconSize }}
                priority={false}
              />
            </div>
          )}

          <span
            className="uppercase"
            style={{
              fontSize: labelSize,
              color: TEXTTIMELINE,
              letterSpacing: "0.22em",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </li>
  );
}
