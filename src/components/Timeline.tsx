// components/Timeline.tsx
"use client";

import Image from "next/image";
import * as React from "react";

const HIGHLIGHT = "#A7CDE6";
const TEXTTIMELINE = "#7B7C7C";

type CSSVarProps<T extends string> = React.CSSProperties & Record<T, string>;

type Item = {
  time: string;
  label: string;
  side?: "left" | "right";
  icon?: string;
};

export default function Timeline({
  items,
  title,
  className,
  titleClassName,
  itemClassName,
}: {
  items: Item[];
  title?: string;
  className?: string;
  titleClassName?: string;
  itemClassName?: string;
}) {
  const cornerVarStyle: CSSVarProps<"--corner"> = { ["--corner"]: "clamp(120px,28vw,220px)" };

  return (
    <section className={`relative ${className ?? ""}`} style={cornerVarStyle}>
      {title && (
        <div className="mb-4 sm:mb-6 text-center relative z-10">
          <div
            className={`mb-2 tracking-wide ${titleClassName ?? ""}`}
            style={{ color: TEXTTIMELINE, fontSize: "clamp(28px, 6vw, 54px)", lineHeight: 1.06 }}
          >
            {title}
          </div>
        </div>
      )}

      <Image
        src="/leaves.png"
        alt=""
        width={400}
        height={400}
        aria-hidden
        className="pointer-events-none select-none"
        style={{
          position: "absolute",
          zIndex: 0,
          width: "var(--corner)",
          height: "auto",
          top: "calc(-0.27 * var(--corner))",
          right: "calc(-0.18 * var(--corner))",
        }}
        priority={false}
      />
      <Image
        src="/leaves.png"
        alt=""
        width={400}
        height={400}
        aria-hidden
        className="pointer-events-none select-none"
        style={{
          position: "absolute",
          zIndex: 0,
          width: "var(--corner)",
          height: "auto",
          left: "calc(-0.22 * var(--corner))",
          bottom: "calc(-0.32 * var(--corner))",
          transform: "rotate(180deg)",
        }}
        priority={false}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-2 sm:px-3 pb-[calc(0.22*var(--corner))]">
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 z-10"
          style={{ backgroundColor: HIGHLIGHT }}
        />

        <ol
          className="
            relative z-10
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
                <div className="relative flex items-center justify-end pr-3 sm:pr-6">
                  {side === "left" ? (
                    <>
                      <span
                        className="absolute right-0 top-1/2 h-px"
                        style={{ backgroundColor: HIGHLIGHT, width: "clamp(28px, 12vw, 88px)" }}
                      />
                      <ItemBox
                        time={it.time}
                        label={it.label}
                        align="right"
                        color={HIGHLIGHT}
                        icon={it.icon}
                        itemClassName={itemClassName}
                      />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>

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

                <div className="relative flex items-center justify-start pl-3 sm:pl-6">
                  {side === "right" ? (
                    <>
                      <span
                        className="absolute left-0 top-1/2 h-px"
                        style={{ backgroundColor: HIGHLIGHT, width: "clamp(28px, 12vw, 88px)" }}
                      />
                      <ItemBox
                        time={it.time}
                        label={it.label}
                        align="left"
                        color={HIGHLIGHT}
                        icon={it.icon}
                        itemClassName={itemClassName}
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
  const widthClass =
    "w-[min(40vw,260px)] xs:w-[min(42vw,260px)] sm:w-[clamp(200px,34vw,260px)]";

  const iconSize = "clamp(36px, 10vw, 72px)";
  const timeSize = "clamp(14px, 3.8vw, 18px)";
  const labelSize = "clamp(12px, 3.2vw, 15px)";

  return (
    <div className={`${widthClass} leading-tight ${align === "left" ? "text-left" : "text-right"} ${itemClassName ?? ""}`}>
      <div className={`flex ${rowDir} items-center justify-between gap-2`}>
        <div>
          <div
            className="font-extrabold uppercase tracking-wide"
            style={{ color, fontSize: timeSize }}
          >
            {time}
          </div>
          <div
            className="tracking-wide"
            style={{ color: TEXTTIMELINE, fontSize: labelSize }}
          >
            {label}
          </div>
        </div>

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
