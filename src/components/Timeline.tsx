// components/Timeline.tsx
"use client";

import Image from "next/image";
import * as React from "react";

const HIGHLIGHT = "#A7CDE6";
const TEXTTIMELINE = "#7B7C7C";
const ARM = "clamp(18px, 7vw, 44px)";
const ICON_PAD = "clamp(6px, 1.6vw, 14px)";

type CSSVarProps<T extends string> = React.CSSProperties & Record<T, string>;

export type Item = {
  time: string;
  label: string;
  side?: "left" | "right";
  icon?: string;
};

export default function Timeline({
  // 👇 si viene undefined, que sea []
  items = [],
  title,
  className,
  titleClassName,
  itemClassName,
}: {
  items?: Item[];     // 👈 ahora opcional
  title?: string;
  className?: string;
  titleClassName?: string;
  itemClassName?: string;
}) {
  const safeItems = Array.isArray(items) ? items : []; // 👈 defensa extra
  const cornerVarStyle: CSSVarProps<"--corner"> = { ["--corner"]: "clamp(120px,28vw,220px)" };

  return (
    <section className={`relative ${className ?? ""}`} style={cornerVarStyle}>
      {title && (
        <div className="mb-3 text-center relative z-10">
          <div
            className={`mb-1 tracking-wide mt-6 ${titleClassName ?? ""}`}
            style={{ color: TEXTTIMELINE, fontSize: "clamp(28px, 6vw, 54px)", lineHeight: 1.06 }}
          >
            {title}
          </div>
        </div>
      )}

      {/* adornos */}
      <Image
        src="/leaves.png"
        alt=""
        width={400}
        height={400}
        aria-hidden
        className="
    pointer-events-none select-none absolute z-0
    top-[-25px] right-[-20px]               /* móvil */
    sm:top-[calc(-0.20_*_var(--corner))]    /* ≥640px */
    sm:right-[calc(-0.18_*_var(--corner))]
  "
  style={{ width: "var(--corner)", height: "auto" }}
        priority={false}
      />
      <Image
        src="/leaves.png"
        alt=""
        width={400}
        height={400}
        aria-hidden
        className="
    pointer-events-none select-none absolute z-0
    bottom-[-60px] left-[-20px]               /* móvil */
    sm:bottom-[calc(-0.27_*_var(--corner))]    /* ≥640px */
    sm:left-[calc(-0.18_*_var(--corner))]
  "
  style={{ width: "var(--corner)", height: "auto", transform: "rotate(180deg)" }}
        priority={false}
      />

      <div className="relative mx-auto w-full max-w-[980px] px-2 sm:px-3">
        {/* línea central */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 z-10"
          style={{ backgroundColor: HIGHLIGHT }}
        />

        <ol
          className="
            relative z-10
            grid
            grid-cols-[minmax(104px,36vw)_1px_minmax(104px,36vw)]
            sm:grid-cols-[minmax(180px,28vw)_1px_minmax(180px,28vw)]
            auto-rows-[minmax(50px,auto)]
            gap-y-3 sm:gap-y-5
            justify-center
          "
        >
          {safeItems.map((it, i) => {
            const side: "left" | "right" = it.side ?? (i % 2 === 0 ? "left" : "right");
            return (
              <li key={i} className="contents">
                {/* izquierda */}
                <div
                  className="relative flex items-center justify-end pr-3 sm:pr-6"
                  style={{ paddingRight: `calc(${ARM} + 8px)` }}
                >
                  {side === "left" ? (
                    <>
                      <span className="absolute right-0 top-1/2 h-px" style={{ backgroundColor: HIGHLIGHT, width: ARM }} />
                      <ItemBox time={it.time} label={it.label} align="right" color={HIGHLIGHT} icon={it.icon} itemClassName={itemClassName} />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>

                {/* punto */}
                <div className="relative">
                  <span
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: HIGHLIGHT, width: "clamp(8px, 1.8vw, 10px)", height: "clamp(8px, 1.8vw, 10px)", display: "block" }}
                  />
                </div>

                {/* derecha */}
                <div
                  className="relative flex items-center justify-start pl-3 sm:pl-6"
                  style={{ paddingLeft: `calc(${ARM} + 8px)` }}
                >
                  {side === "right" ? (
                    <>
                      <span className="absolute left-0 top-1/2 h-px" style={{ backgroundColor: HIGHLIGHT, width: ARM }} />
                      <ItemBox time={it.time} label={it.label} align="left" color={HIGHLIGHT} icon={it.icon} itemClassName={itemClassName} />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* si no hay items, no crashea y no muestra nada */}
        {safeItems.length === 0 && (
          <div className="sr-only">Sin eventos en el itinerario</div>
        )}
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
  itemClassName,
}: {
  time: string;
  label: string;
  align: "left" | "right";
  color: string;
  icon?: string;
  itemClassName?: string;
}) {
  const rowDir = align === "left" ? "flex-row" : "flex-row-reverse";
  const widthClass = "w-[min(36vw,220px)] xs:w-[min(38vw,230px)] sm:w-[clamp(180px,28vw,240px)]";

  const iconSize = "clamp(36px, 10vw, 72px)";
  const timeSize = "clamp(14px, 3.6vw, 18px)";
  const labelSize = "clamp(12px, 3.1vw, 15px)";

  return (
    <div className={`${widthClass} leading-tight ${align === "left" ? "text-left" : "text-right"} ${itemClassName ?? ""}`}>
      <div className={`flex ${rowDir} items-center justify-between gap-3`}>
        <div>
          <div className="font-extrabold uppercase tracking-wide" style={{ color, fontSize: timeSize }}>{time}</div>
          <div className="tracking-wide" style={{ color: TEXTTIMELINE, fontSize: labelSize, overflowWrap: "anywhere" }}>{label}</div>
        </div>

        {icon && (
          <div className="relative z-20 shrink-0" style={{ padding: ICON_PAD }}>
            <Image src={icon} width={72} height={72} alt="" aria-hidden className="block" style={{ width: iconSize, height: iconSize }} priority={false} />
          </div>
        )}
      </div>
    </div>
  );
}
