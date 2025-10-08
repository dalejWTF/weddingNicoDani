// components/Timeline.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

type Item = { time: string; label: string }; // time: "5:00 PM" (o "17:00")

function parseTimeToDate(time: string, base: Date) {
    // admite "h:mm AM/PM" o "HH:mm"
    const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return new Date(base);
    let [_, hh, mm, mer] = m;
    let h = parseInt(hh, 10);
    const mins = parseInt(mm, 10);
    if (mer) {
        const up = mer.toUpperCase();
        if (up === "PM" && h < 12) h += 12;
        if (up === "AM" && h === 12) h = 0;
    }
    const d = new Date(base);
    d.setHours(h, mins, 0, 0);
    return d;
}

export default function Timeline({
    items,
    title,
    className,
    live = false,
    dateBase,
}: {
    items: Item[];
    title?: string;
    className?: string;
    live?: boolean;
    dateBase?: Date; // requerido si live=true
}) {
    const containerRef = React.useRef<HTMLOListElement | null>(null);
    const [, force] = React.useReducer((x) => x + 1, 0);
    const dotRefs = React.useRef<Array<HTMLSpanElement | null>>([]);

    const times = React.useMemo(
        () => (dateBase ? items.map((it) => parseTimeToDate(it.time, dateBase)) : []),
        [items, dateBase]
    );

    // Recalcular cada 30s y al resize (solo si live)
    React.useEffect(() => {
        if (!live) return;
        const id = setInterval(force, 30_000);
        const onResize = () => force();
        window.addEventListener("resize", onResize);
        return () => { clearInterval(id); window.removeEventListener("resize", onResize); };
    }, [live]);

    // Medir posiciones verticales (centro del corazón de cada item)
    const yPositions = React.useMemo(() => {
        if (!containerRef.current) return [];
        return dotRefs.current.map((el) => {
            if (!el || !containerRef.current) return 0;
            const cTop = containerRef.current.getBoundingClientRect().top;
            const r = el.getBoundingClientRect();
            return r.top + r.height / 2 - cTop; // y relativo al <ol>
        });
    }, [items, force]); // se reevalúa cuando forzamos

    // Calcular Y actual del marcador vivo
    let liveY: number | null = null;
    if (live && dateBase && times.length >= 2 && yPositions.length === times.length) {
        const now = new Date();
        const first = times[0].getTime();
        const last = times[times.length - 1].getTime();
        const cy = (i: number) => yPositions[i];

        if (now.getTime() <= first) {
            liveY = cy(0);
        } else if (now.getTime() >= last) {
            liveY = cy(times.length - 1);
        } else {
            // busca el segmento donde cae 'now'
            for (let i = 0; i < times.length - 1; i++) {
                const t0 = times[i].getTime();
                const t1 = times[i + 1].getTime();
                if (now.getTime() >= t0 && now.getTime() <= t1) {
                    const p = (now.getTime() - t0) / (t1 - t0); // 0..1
                    liveY = cy(i) + p * (cy(i + 1) - cy(i));
                    break;
                }
            }
        }
    }

    return (
        <section className={className}>
            {title && (
                <div className="flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-wide mb-2">
                    <Heart className="size-4" /> {title}
                </div>
            )}

            <div className="relative overflow-x-hidden">
                {/* línea + puntos */}
                <ol ref={containerRef} className="relative pl-5 border-s">
                    {items.map((it, i) => (
                        <li key={i} className="ms-6 py-3">
                            {/* punto de cada evento (referencia para medir) */}
                            <span
                                ref={(el) => {            // <- bloque, sin return
                                    dotRefs.current[i] = el;
                                }}
                                className="absolute left-0 top-3 -translate-x-1/2 grid place-items-center size-4 rounded-full bg-rose-500 text-white shadow"
                            >
                                <Heart className="size-3" />
                            </span>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-neutral-600 text-sm whitespace-nowrap">{it.time}</span>
                                <span className="text-sm">{it.label}</span>
                            </div>
                        </li>
                    ))}
                </ol>

                {/* marcador vivo */}
                {live && liveY !== null && (
                    <motion.span
                        aria-hidden
                        className="pointer-events-none absolute left-0 -translate-x-1/2 grid place-items-center size-5 rounded-full bg-rose-600 text-white shadow-lg"
                        animate={{ top: liveY }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <Heart className="size-3" />
                    </motion.span>
                )}
            </div>
        </section>
    );
}
