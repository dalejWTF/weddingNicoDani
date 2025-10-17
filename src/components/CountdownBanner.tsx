"use client";

import * as React from "react";

function pad(n: number) { return String(n).padStart(2, "0"); }
const COLOR = "#C4F0FD";

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
    <div className="mt-1 flex items-end justify-center gap-3 font-semibold tabular-nums">
      {values.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="text-center min-w-16">
            <div className="text-4xl sm:text-5xl leading-none">{u.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-neutral-500">{u.label}</div>
          </div>
          {i < values.length - 1 && <span className="text-3xl pb-6">:</span>}
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
        <div className="text-center text-xs uppercase tracking-[0.2em] text-neutral-600">Faltan…</div>
        {renderRow(values)}
      </div>
    );
  };

  return (
    <section className={"border bg-blue-500/10 px-3 py-3 my-9 shadow-inner " + (className ?? "")} style={{ backgroundColor: COLOR }}> 
      {mounted ? (
        content()
      ) : (
        <div className="w-full" suppressHydrationWarning>
          <div className="text-center text-xs uppercase tracking-[0.2em] text-neutral-600">Faltan…</div>
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
