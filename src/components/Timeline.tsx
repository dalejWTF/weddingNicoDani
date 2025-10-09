// components/Timeline.tsx
"use client";

type Item = { time: string; label: string; side?: "left" | "right" };

export default function Timeline({
  items,
  title,
  className,
}: {
  items: Item[];
  title?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      {title && (
        <div className="mb-2 text-center text-sm font-medium uppercase tracking-wide">
          {title}
        </div>
      )}

      {/* Contenedor ajustado al contenido: centra la línea y evita grandes márgenes laterales */}
      <div className="relative mx-auto w-fit px-2">
        {/* Línea vertical central (solo ≥ sm) */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-neutral-300 sm:block" />

        {/* DESKTOP/TABLET: zig-zag, 1 ítem por fila, columnas ajustadas al contenido */}
        <ol className="hidden sm:grid sm:grid-cols-[max-content_1px_max-content] sm:auto-rows-[60px] sm:gap-y-6">
          {items.map((it, i) => {
            const side: "left" | "right" = it.side ?? (i % 2 === 0 ? "left" : "right");
            return (
              <li key={i} className="contents">
                {/* Celda izquierda */}
                <div className="relative flex items-center justify-end pr-5">
                  {side === "left" ? (
                    <>
                      {/* Conector hacia la línea */}
                      <span className="absolute right-0 top-1/2 h-px w-10 bg-neutral-500" />
                      <ItemBox time={it.time} label={it.label} align="right" />
                    </>
                  ) : (
                    // placeholder para mantener el ancho de la columna
                    <span className="sr-only">spacer</span>
                  )}
                </div>

                {/* Punto en la línea */}
                <div className="relative">
                  <span className="absolute left-1/2 top-1/2 z-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-700" />
                </div>

                {/* Celda derecha */}
                <div className="relative flex items-center justify-start pl-5">
                  {side === "right" ? (
                    <>
                      <span className="absolute left-0 top-1/2 h-px w-10 bg-neutral-500" />
                      <ItemBox time={it.time} label={it.label} align="left" />
                    </>
                  ) : (
                    <span className="sr-only">spacer</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* MÓVIL: una columna con línea a la izquierda */}
        <ol className="relative pl-5 border-l border-neutral-300 sm:hidden">
          {items.map((it, i) => (
            <li key={i} className="relative py-3">
              <span className="absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-700" />
              <div className="ml-3">
                <ItemBox time={it.time} label={it.label} align="left" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ItemBox({
  time,
  label,
  align,
}: {
  time: string;
  label: string;
  align: "left" | "right";
}) {
  return (
    <div className={`w-[220px] leading-tight ${align === "left" ? "text-left" : "text-right"}`}>
      <div className="text-[13px] font-extrabold uppercase tracking-wide text-neutral-900">
        {time}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-neutral-600">
        {label}
      </div>
    </div>
  );
}
