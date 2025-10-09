// components/DressCode.tsx
"use client";

type Swatch = { color: string; name?: string };

export default function DressCode({
  title = "DRESS CODE",
  subtitle = "black tie optional",
  message = "We kindly encourage our guests to join us in wearing the following colors",
  colors = DEFAULT_COLORS,
  className,
}: {
  title?: string;
  subtitle?: string;
  message?: string;
  colors?: Swatch[];
  className?: string;
}) {
  return (
    <section className={`w-full ${className ?? ""}`}>
      <div className="mx-auto max-w-[640px] rounded-3xl border bg-white/90 px-6 py-7 shadow-sm">
        {/* Título & subtítulo */}
        <div className="text-center">
          <h3 className="text-3xl sm:text-4xl tracking-[0.18em] font-medium uppercase">
            {title}
          </h3>
          <div className="mt-1 font-brand text-2xl sm:text-3xl leading-none text-neutral-700">
            {subtitle}
          </div>
          <p className="mt-3 text-sm text-neutral-600">
            {message}
          </p>
        </div>

        {/* Paleta */}
        <div className="mx-auto mt-5 grid max-w-[560px] grid-cols-5 gap-3 sm:gap-4">
          {colors.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span
                className="size-12 sm:size-14 rounded-full ring-1 ring-black/5 shadow-inner"
                style={{ backgroundColor: s.color }}
                aria-label={s.name ?? s.color}
                title={s.name ?? s.color}
              />
              {s.name && (
                <span className="mt-1 text-[10px] text-neutral-500">{s.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const DEFAULT_COLORS: Swatch[] = [
  { color: "#EEE7DF" }, // cream
  { color: "#E6C0A6" }, // blush tan
  { color: "#E7B49A" }, // peach
  { color: "#DCD5D2" }, // soft taupe
  { color: "#9C867C" }, // mocha
  { color: "#C9B2A6" }, // dusty rose
  { color: "#EBD8CD" }, // light rose
  { color: "#C9C2BC" }, // warm gray
  { color: "#9AA296" }, // sage gray
  { color: "#889A8F" }, // sage green
];
