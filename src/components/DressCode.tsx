// components/DressCode.tsx
"use client";

import { Mars, Venus } from "lucide-react";

type Swatch = { color: string; name?: string };

export default function DressCode({
  title = "CÓDIGO DE VESTIMENTA",
  message1 = "Se recomienda no usar blanco ni tonalidades similares ya que es el color de la novia.",
  message2 = "Invitados en general pueden usar tonos pasteles, colores claros o vibrantes.",
  colors = DEFAULT_COLORS,               // fallback: 8 colores (4 mujeres, 4 hombres)
  womenColors,
  menColors,
  className,
}: {
  title?: string;
  message1?: string;
  message2?: string;
  colors?: Swatch[];
  womenColors?: Swatch[];               // opcional: define explícito
  menColors?: Swatch[];                 // opcional: define explícito
  className?: string;

}) {
  // 1) determina grupos: si pasan womenColors/menColors, úsalo; si no, reparte 4/4 del array `colors`
  const w = (womenColors && womenColors.length ? womenColors.slice(0, 4) : colors.slice(0, 4));
  const m = (menColors && menColors.length ? menColors.slice(0, 4) : colors.slice(4, 8));

  return (
    <section className={`w-full ${className ?? ""}`}>
      <div className="mx-auto max-w-[640px] rounded-3xl  bg-white/90 px-6 py-7 ">
        {/* Títulos */}
        <div className="text-center">
          <h3 className="text-3xl sm:text-4xl tracking-[0.18em] font-medium uppercase">{title}</h3>
          <p className="mt-3 text-sm text-neutral-600">{message1}</p>
        </div>

        {/* Grupos */}
        <div className="mt-6 grid gap-5">
          <PaletteGroup label="Damas" icon={<Venus className="size-4" />} colors={w} />         
          <PaletteGroup label="Caballeros" icon={<Mars className="size-4" />} colors={m} />
        </div>
        <div className="text-center pt-4">
            <p className="mt-3 text-sm text-neutral-600">{message2}</p>
          </div>
      </div>
    </section>
  );
}

function PaletteGroup({
  label,
  icon,
  colors,
}: {
  label: string;
  icon?: React.ReactNode;
  colors: Swatch[];
}) {
  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {colors.slice(0, 4).map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <span
              className="size-12 sm:size-14 rounded-full ring-1 ring-black/5 shadow-inner"
              style={{ backgroundColor: s.color }}
              aria-label={s.name ?? s.color}
              title={s.name ?? s.color}
            />
            {s.name && <span className="mt-1 text-[10px] text-neutral-500">{s.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// 8 colores por defecto (4 para mujeres, 4 para hombres)
const DEFAULT_COLORS: Swatch[] = [
  // Mujeres
  { color: "#77C3EC" },
  { color: "#89CFF0" },
  { color: "#9DD9F3" },
  { color: "#B8E2F2" },
  // Hombres
  { color: "#9C867C" },
  { color: "#C9B2A6" },
  { color: "#EBD8CD" },
  { color: "#C9C2BC" },
];
