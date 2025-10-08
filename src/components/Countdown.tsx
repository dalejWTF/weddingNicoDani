"use client";

import * as React from "react";

type Props = {
  targetDate: Date;
  className?: string;
};

function two(n: number) { return String(n).padStart(2, "0"); }

export default function Countdown({ targetDate, className }: Props) {
  // Render estable en SSR: no calculamos tiempo hasta montar
  const [mounted, setMounted] = React.useState(false);
  const [now, setNow] = React.useState<number>(0);

  React.useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    // Marcado estable igual en servidor y primer render del cliente
    return (
      <div className={"w-full " + (className ?? "") } suppressHydrationWarning>
        <div className="grid grid-cols-4 max-w-sm mx-auto text-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-2">
              <div className="text-2xl font-semibold tabular-nums">--</div>
              <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                {i === 0 ? "Días" : i === 1 ? "Horas" : i === 2 ? "Min" : "Seg"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const diff = Math.max(0, targetDate.getTime() - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const completed = diff === 0;
  if (completed) {
    return (
      <div className={"w-full text-center " + (className ?? "") }>
        <p className="text-2xl font-semibold">¡Hoy es el gran día!</p>
      </div>
    );
  }

  return (
    <div className={"w-full " + (className ?? "") }>
      <div className="grid grid-cols-4 max-w-sm mx-auto text-center">
        <div className="py-2">
          <div className="text-2xl font-semibold tabular-nums">{days}</div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">Días</div>
        </div>
        <div className="py-2">
          <div className="text-2xl font-semibold tabular-nums">{two(hours)}</div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">Horas</div>
        </div>
        <div className="py-2">
          <div className="text-2xl font-semibold tabular-nums">{two(minutes)}</div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">Min</div>
        </div>
        <div className="py-2">
          <div className="text-2xl font-semibold tabular-nums">{two(seconds)}</div>
          <div className="text-[11px] uppercase tracking-wide text-neutral-500">Seg</div>
        </div>
      </div>
    </div>
  );
}