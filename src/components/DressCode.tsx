// components/DressCode.tsx
"use client";

import { Mars, Venus } from "lucide-react";

type Swatch = { color: string; name?: string };

const SOFT_BORDER = "#DBEAF5";
const SOFT_ACCENT = "#8FBFD9";
const COUPLE = "/couple.png";
export default function DressCode({
  title = "CÓDIGO DE VESTIMENTA",
  message1 = "Se recomienda no usar blanco ni tonalidades similares ya que es el color de la novia.",
  message2 = "Invitados en general pueden usar tonos pasteles, colores claros o vibrantes.",
  colors = DEFAULT_COLORS,
  womenColors,
  menColors,
  className,
}: {
  title?: string;
  message1?: string;
  message2?: string;
  colors?: Swatch[];
  womenColors?: Swatch[];
  menColors?: Swatch[];
  className?: string;
}) {
  const w = (womenColors && womenColors.length ? womenColors.slice(0, 4) : colors.slice(0, 4));
  const m = (menColors && menColors.length ? menColors.slice(0, 4) : colors.slice(4, 8));

  return (
    <section className={`w-full ${className ?? ""}`}>

      <div
        className="mx-auto max-w-[640px] rounded-3xl px-6 py-7">
        <div className="text-center">
          <h3 className="text-3xl sm:text-4xl tracking-[0.18em] font-medium uppercase text-slate-800">{title}</h3>
          <img
            src={COUPLE}
            alt=""
            width="200"
            height="auto"
            className="pointer-events-none mx-auto mt-4"
            style={{
              height: "auto",
            }}
          />
          <p className="mt-3 text-sm text-slate-600">{message1}</p>
        </div>

        <div className="mt-6 grid gap-5">
          <PaletteGroup label="Damas" icon={<Venus className="size-4" style={{ color: SOFT_ACCENT }} />} colors={w} />
          <PaletteGroup label="Caballeros" icon={<Mars className="size-4" style={{ color: SOFT_ACCENT }} />} colors={m} />
        </div>
        <div className="text-center pt-4">
          <p className="mt-3 text-sm text-slate-600">{message2}</p>
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
      <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {colors.slice(0, 4).map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <span
              className="size-12 sm:size-14 rounded-full ring-1 shadow-inner"
              style={{ backgroundColor: s.color, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)", borderColor: SOFT_BORDER }}
              aria-label={s.name ?? s.color}
              title={s.name ?? s.color}
            />
            {s.name && <span className="mt-1 text-[10px] text-slate-500">{s.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

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
