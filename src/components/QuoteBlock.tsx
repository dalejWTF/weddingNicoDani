// components/QuoteBlock.tsx
"use client";

export default function QuoteBlock({
  quote,
  author,
  className,
  classNameQuote,
  classNameAuthor,
}: {
  quote: string;
  author?: string;
  className?: string;
  classNameQuote?: string;
  classNameAuthor?: string;
}) {
  return (
    <figure className={`rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${className ?? ""}`}>
      <blockquote className={`text-center italic text-slate-700 ${classNameQuote ?? ""}`}>
        “{quote}”
      </blockquote>
      {author && (
        <figcaption className={`mt-2 text-center text-xs text-slate-500 ${classNameAuthor ?? ""}`}>
          — {author}
        </figcaption>
      )}
    </figure>
  );
}
