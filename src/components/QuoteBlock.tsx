// components/QuoteBlock.tsx
"use client";

export default function QuoteBlock({ quote, author }: { quote: string; author?: string }) {
  return (
    <figure className="rounded-2xl bg-white p-5 shadow-md border border-rose-200">
      <blockquote className="text-center italic text-neutral-700">“{quote}”</blockquote>
      {author && <figcaption className="mt-2 text-center text-xs text-neutral-500">— {author}</figcaption>}
    </figure>
  );
}