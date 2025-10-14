// components/CalendarMonth.tsx
"use client";

import * as React from "react";
import { Heart } from "lucide-react";

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysInMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }

export default function CalendarMonth({ date, highlightDate, startOnSunday = false }: { date: Date; highlightDate?: Date; startOnSunday?: boolean; }) {
  const base = startOfMonth(date);
  const total = daysInMonth(date);
  const highlight = highlightDate ? new Date(highlightDate) : undefined;

  // Offset según inicio de semana
  const startOffset = startOnSunday ? base.getDay() : ((base.getDay() + 6) % 7);

  const weeks: (number | null)[] = Array.from({ length: startOffset + total }, (_, i) => (i < startOffset ? null : i - startOffset + 1));
  while (weeks.length % 7 !== 0) weeks.push(null);

  const daysShort = startOnSunday ? ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"] : ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <div className="w-full select-none px-3">
      <div className="border-t border-b border-blue-600/25">
        <div className="grid grid-cols-7 text-center text-[11px] uppercase tracking-wide text-neutral-600">
          {daysShort.map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="border-t border-blue-600/25" />
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
                        className="absolute pointer-events-none size-7 sm:size-8 text-blue-600/25 fill-current"
                      />
                    )}
                    <span
                      className={
                        "relative z-10 " +
                        (isHighlight ? "font-semibold text-neutral-900" : "text-neutral-800")
                      }
                    >
                      {day}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}