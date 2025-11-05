// components/CalendarMonth.tsx
"use client";

import * as React from "react";
import { Heart } from "lucide-react";

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysInMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }

const SOFT_BORDER = "#DBEAF5";
const SOFT_ACCENT = "#8FBFD9";

export default function CalendarMonth({
  date, highlightDate, startOnSunday = false
}: { date: Date; highlightDate?: Date; startOnSunday?: boolean; }) {
  const base = startOfMonth(date);
  const total = daysInMonth(date);
  const highlight = highlightDate ? new Date(highlightDate) : undefined;
  const startOffset = startOnSunday ? base.getDay() : ((base.getDay() + 6) % 7);
  const weeks: (number | null)[] = Array.from({ length: startOffset + total }, (_, i) => (i < startOffset ? null : i - startOffset + 1));
  while (weeks.length % 7 !== 0) weeks.push(null);
  const daysShort = startOnSunday ? ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"] : ["L", "M", "X", "J", "V", "S", "D"];

  return (
    // Contenedor posicionable + padding para el adorno inferior
    <div
      className="relative w-full select-none px-3
             [--corner:clamp(112px,38vw,260px)]
             sm:[--corner:clamp(52px,16vw,210px)]"
      style={{
        paddingBottom: "calc(var(--corner) * 0.25)",
      }}
    >
      <div className="border-t" style={{ borderColor: SOFT_BORDER }}>
        <div className="grid grid-cols-7 text-center text-[11px] uppercase tracking-wide text-slate-600">
          {daysShort.map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="border-t" style={{ borderColor: SOFT_BORDER }} />
        <div className="grid grid-cols-7">
          {weeks.map((day, idx) => {
            const isHighlight =
              day !== null &&
              highlight &&
              highlight.getFullYear() === date.getFullYear() &&
              highlight.getMonth() === date.getMonth() &&
              highlight.getDate() === day;

            return (
              <div key={idx} className="aspect-square grid place-items-center text-sm">
                {day === null ? (
                  <span className="invisible">-</span>
                ) : (
                  <div className="relative grid place-items-center size-9 sm:size-10">
                    {isHighlight && (
                      <Heart
                        aria-hidden
                        className="absolute pointer-events-none size-7 sm:size-8 fill-current"
                        style={{ color: SOFT_ACCENT }}
                      />
                    )}
                    <span className={"relative z-10 " + (isHighlight ? "font-semibold text-slate-900" : "text-slate-800")}>
                      {day}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Adorno: MISMO PORTE (usa --corner) y pegado al final del calendario */}
      <img
        src="/leaves.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none"
        style={{
          position: "absolute",
          zIndex: 20,
          width: "var(--corner)",   // ← mismo porte que el countdown
          height: "auto",
          left: "calc(-0.22 * var(--corner))",
          bottom: "calc(-0.12 * var(--corner))",
          transform: "rotate(180deg)",
        }}
      />
    </div>
  );
}
