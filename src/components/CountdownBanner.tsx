// CountdownBanner.tsx
"use client";
import * as React from "react";

function pad(n: number) { return String(n).padStart(2, "0"); }

const BABY_BLUE_TOP = "#F7FBFE";
const BABY_BLUE_BOTTOM = "#EFF7FD";
const BABY_BLUE_BORDER = "#DBEAF5";

// Ruta del PNG (si está en /public/assets/)
const CORNER = "/leaves.png";
// Alternativa con import:
// import corner from "@/assets/blue-corner.png"; const CORNER = corner.src;

export default function CountdownBanner({ date, className }: { date: Date; className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [now, setNow] = React.useState<number>(0);

  React.useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const total = Math.max(0, date.getTime() - now) / 1000 | 0;
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const values = [
    { value: String(days), label: "DÍAS" },
    { value: pad(hours), label: "HORAS" },
    { value: pad(minutes), label: "MINUTOS" },
    { value: pad(seconds), label: "SEGUNDOS" },
  ];

  const renderRow = (vs: Array<{ value: string; label: string }>) => (
    <div className="mt-2 flex items-end justify-center gap-3 font-medium tabular-nums">
      {vs.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="text-center min-w-16">
            <div className="text-4xl sm:text-5xl leading-none text-slate-800">{u.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">{u.label}</div>
          </div>
          {i < vs.length - 1 && <span className="pb-6 text-2xl text-slate-400/60">:</span>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section
      className={[
        // móvil: grande
        "[--corner:clamp(112px,38vw,260px)]",
        // sm+ (>=640px): tu valor actual
        "sm:[--corner:clamp(52px,16vw,210px)]",
        "relative overflow-visible rounded-2xl my-9 w-full px-4 py-4 sm:px-6 sm:py-5",
        className ?? ""
      ].join(" ")}
    >
      {/* Overlay esquina superior derecha */}
      <img
        src={CORNER}
        alt=""
        aria-hidden
        className="pointer-events-none"
        style={{
          position: "absolute",
          zIndex: 20,
          width: "var(--corner)",   // responsivo
          height: "auto",
          top: "calc(-0.28 * var(--corner))",   // sobresale un poco hacia afuera
          right: "calc(-0.18 * var(--corner))",
          // Si tu imagen está “pensada” para la esquina superior izquierda,
          // espejar para usarla en la derecha:

        }}
      />

      {mounted ? (
        <div className="w-full">
          <div className="text-center text-xs uppercase tracking-[0.22em] text-slate-600">Faltan…</div>
          {renderRow(values)}
        </div>
      ) : (
        <div className="w-full" suppressHydrationWarning>
          <div className="text-center text-xs uppercase tracking-[0.22em] text-slate-600">Faltan…</div>
          {renderRow([
            { value: "--", label: "DÍAS" },
            { value: "--", label: "HORAS" },
            { value: "--", label: "MINUTOS" },
            { value: "--", label: "SEGUNDOS" },
          ])}
        </div>
      )}
    </section>
  );
}
