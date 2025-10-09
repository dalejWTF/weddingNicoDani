// components/VenueBlock.tsx
"use client";

import { MapPin } from "lucide-react";

type Props = {
  title?: string;
  name: string;
  address?: string;
  time?: string; // e.g. "16:30"
  mapUrl: string;
  className?: string;
};

export default function VenueBlock({ title, name, address, time, mapUrl, className }: Props) {
  return (
    <section className={"text-center " + (className ?? "") }>
      {title && <div className="text-sm font-medium">{title}</div>}
      <div className="inline-flex items-center gap-2 text-sm font-medium">
        <MapPin className="size-4" />
        <span>{name}</span>
      </div>
      {time && <div className="text-sm text-neutral-700">{time}</div>}
      {address && <div className="text-sm text-neutral-600">{address}</div>}
      <div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block underline underline-offset-4 text-rose-600"
          aria-label={`Ver ${name} en el mapa`}
        >
          Ver mapa
        </a>
      </div>
    </section>
  );
}