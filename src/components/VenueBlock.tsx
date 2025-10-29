// components/VenueBlock.tsx
"use client";

import { MapPin, Clock } from "lucide-react";

const SOFT_BG = "#FFFFFF";
const SOFT_ACCENT = "#8FBFD9";

type Props = {
  title?: string;
  name: string;
  address?: string;
  time?: string;
  mapUrl: string;
  className?: string;
};

export default function VenueBlock({ title, name, address, time, mapUrl, className }: Props) {
  return (
    <section className={`w-full ${className ?? ""}`}>
      <div
        className="mx-auto w-full max-w-[520px] rounded-3xl px-6 py-6"
        style={{ backgroundColor: SOFT_BG }}
      >
        <div
          className="mx-auto grid size-12 place-items-center rounded-2xl shadow-sm"
          style={{ color: SOFT_ACCENT }}
        >
          <MapPin className="size-6" />
        </div>

        <div className="mt-4 text-center">
          {title && (
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </div>
          )}

          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {name}
          </h3>

          {time && (
            <div className="mt-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: "#F7FBFE" }}
              >
                <Clock className="size-3" />
                {time}
              </span>
            </div>
          )}

          {address && <p className="mt-2 text-sm text-slate-600">{address}</p>}

          <div className="mt-4">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver ${name} en el mapa`}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition"
              style={{
                backgroundColor: "#EAF3FB",
                color: "#0F172A",
                
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              Ver mapa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
