// components/CountdownBanner.tsx
"use client";

import * as React from "react";

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function CountdownBanner({ date, className }: { date: Date; className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [now, setNow] = React.useState<number>(0);
  React.useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const content = () => {
    const diff = Math.max(0, date.getTime() - now);
    const total = Math.floor(diff / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    return (
      <div className="w-full">
        <div className="text-center text-xs uppercase tracking-[0.2em] text-neutral-600">Faltan…</div>
        <div className="flex items-baseline justify-center gap-3 font-semibold tabular-nums">
          <span className="text-4xl sm:text-5xl">{days}</span>
          <span className="text-3xl">:</span>
          <span className="text-4xl sm:text-5xl">{pad(hours)}</span>
          <span className="text-3xl">:</span>
          <span className="text-4xl sm:text-5xl">{pad(minutes)}</span>
          <span className="text-3xl">:</span>
          <span className="text-4xl sm:text-5xl">{pad(seconds)}</span>
        </div>
        <div className="grid grid-cols-4 max-w-sm mx-auto text-center mt-1">
          {['DÍAS','HORAS','MINUTOS','SEGUNDOS'].map((l) => (
            <div key={l} className="text-[11px] uppercase tracking-wide text-neutral-500">{l}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className={"rounded-2xl border bg-neutral-100/70 px-4 py-3 shadow-inner " + (className ?? '')}>
      {mounted ? content() : (
        <div className="w-full" suppressHydrationWarning>
          <div className="text-center text-xs uppercase tracking-[0.2em] text-neutral-600">Faltan…</div>
          <div className="flex items-baseline justify-center gap-3 font-semibold tabular-nums">
            <span className="text-4xl sm:text-5xl">--</span>
            <span className="text-3xl">:</span>
            <span className="text-4xl sm:text-5xl">--</span>
            <span className="text-3xl">:</span>
            <span className="text-4xl sm:text-5xl">--</span>
            <span className="text-3xl">:</span>
            <span className="text-4xl sm:text-5xl">--</span>
          </div>
          <div className="grid grid-cols-4 max-w-sm mx-auto text-center mt-1">
            {['DÍAS','HORAS','MINUTOS','SEGUNDOS'].map((l) => (
              <div key={l} className="text-[11px] uppercase tracking-wide text-neutral-500">{l}</div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}