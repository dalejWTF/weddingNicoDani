// CountdownBanner.tsx
"use client";

import * as React from "react";

function pad(n: number) { return String(n).padStart(2, "0"); }

// Paleta baby blue MUY sutil (ideal para invitación)
const BABY_BLUE_TOP = "#F7FBFE";     // casi blanco azulado
const BABY_BLUE_BOTTOM = "#EFF7FD";  // baby blue muy tenue
const BABY_BLUE_BORDER = "#DBEAF5";  // borde etéreo

export default function CountdownBanner({ date, className }: { date: Date; className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [now, setNow] = React.useState<number>(0);

  React.useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const renderRow = (values: Array<{ value: string; label: string }>) => (
    <div className="mt-2 flex items-end justify-center gap-3 font-medium tabular-nums">
      {values.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="text-center min-w-16">
            <div className="text-4xl sm:text-5xl leading-none text-slate-800">{u.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">{u.label}</div>
          </div>
          {i < values.length - 1 && <span className="pb-6 text-2xl text-slate-400/60">:</span>}
        </React.Fragment>
      ))}
    </div>
  );

  const content = () => {
    const diff = Math.max(0, date.getTime() - now);
    const total = Math.floor(diff / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    const values = [
      { value: String(days),     label: "DÍAS" },
      { value: pad(hours),       label: "HORAS" },
      { value: pad(minutes),     label: "MINUTOS" },
      { value: pad(seconds),     label: "SEGUNDOS" },
    ];

    return (
      <div className="w-full">
        <div className="text-center text-xs uppercase tracking-[0.22em] text-slate-600">Faltan…</div>
        {renderRow(values)}
      </div>
    );
  };

  return (
    <section
      className={[
        "my-9 w-full border",
        "px-4 py-4 sm:px-6 sm:py-5",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
        className ?? ""
      ].join(" ")}
      style={{
        background: `linear-gradient(180deg, ${BABY_BLUE_TOP} 0%, ${BABY_BLUE_BOTTOM} 100%)`,
        borderColor: BABY_BLUE_BORDER,
      }}
    >
      {mounted ? (
        content()
      ) : (
        <div className="w-full" suppressHydrationWarning>
          <div className="text-center text-xs uppercase tracking-[0.22em] text-slate-600">Faltan…</div>
          {renderRow([
            { value: "--", label: "DÍAS" },
            { value: "--", label: "HORAS" },
            { value: "--", label: "MIN" },
            { value: "--", label: "SEG" },
          ])}
        </div>
      )}
    </section>
  );
}