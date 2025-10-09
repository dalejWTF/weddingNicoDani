// components/Timeline.tsx
"use client";


import { Heart } from "lucide-react";


type Item = { time: string; label: string; };


export default function Timeline({ items, title, className }: { items: Item[]; title?: string; className?: string; }) {
return (
<section className={className}>
{title && (
<div className="flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-wide mb-2">
<Heart className="size-4" /> {title}
</div>
)}
<ol className="relative ml-5 border-s">
{items.map((it, i) => (
<li key={i} className="ms-6 py-3">
<span className="absolute -start-2 top-3 grid place-items-center size-4 rounded-full bg-rose-500 text-white shadow">
<Heart className="size-3" />
</span>
<div className="flex items-center justify-between gap-3">
<span className="text-neutral-600 text-sm whitespace-nowrap">{it.time}</span>
<span className="text-sm">{it.label}</span>
</div>
</li>
))}
</ol>
</section>
);
}