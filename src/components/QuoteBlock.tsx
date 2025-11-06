// components/QuoteBlock.tsx
"use client";

export default function QuoteBlock({ quote, author }: { quote: string; author?: string }) {
  return (
    <figure
      className="rounded-2xl  shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <blockquote className="text-center italic text-slate-700">“{quote}”</blockquote>
      {author && <figcaption className="mt-2 text-center text-xs text-slate-500">— {author}</figcaption>}
    </figure>
  );
}
