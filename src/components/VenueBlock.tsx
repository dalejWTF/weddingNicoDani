// components/VenueBlock.tsx
"use client";

import { MapPin, Clock } from "lucide-react";

const COLOR = "#55BAE9FF";

type Props = {
  title?: string;
  name: string;
  address?: string;
  time?: string;        // e.g. "5:00 PM"
  mapUrl: string;
  className?: string;
};

export default function VenueBlock({
  title,
  name,
  address,
  time,
  mapUrl,
  className,
}: Props) {
  return (
    <section className={`w-full ${className ?? ""}`}>
      <div className="mx-auto w-full max-w-[520px] rounded-3xl bg-white/90 px-6 py-6 ">
        {/* Icono destacado */}
        <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-blue-300/70 shadow-sm">
          <MapPin className="size-6" style={{ color: COLOR }}/>
        </div>

        {/* Texto */}
        <div className="mt-4 text-center">
          {title && (
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {title}
            </div>
          )}

          <h3 className="mt-1 text-lg font-semibold text-neutral-900">
            {name}
          </h3>

          {/* Hora como “pill” visible */}
          {time && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border border-blue-300/70 font-medium" style={{ color: COLOR }}>
                <Clock className="size-3" style={{ color: COLOR }}/>
                {time}
              </span>
            </div>
          )}

          {address && (
            <p className="mt-2 text-sm text-neutral-600">{address}</p>
          )}

          {/* CTA */}
          <div className="mt-4">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver ${name} en el mapa`}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
                         hover:bg-blue-600/75 active:bg-blue-600/75 bg-blue-300/90"
                         
            >
              Ver mapa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
