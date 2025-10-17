// components/QuoteBlock.tsx
"use client";
const COLOR = "#88CFF1";
const BACKGROUNDCOLOR = "#FEFEFA"
export default function QuoteBlock({ quote, author }: { quote: string; author?: string }) {
  return (
    <figure className="rounded-2xl p-5 shadow-md border py-6" style={{backgroundColor: BACKGROUNDCOLOR, borderColor: COLOR }}>
      <blockquote className="text-center italic text-neutral-700">“{quote}”</blockquote>
      {author && <figcaption className="mt-2 text-center text-xs text-neutral-500">— {author}</figcaption>}
    </figure>
  );
}