"use client";

export default function TextBlock({ title, paragraphs }: { title?: string; paragraphs: string[] }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md border border-rose-200">
      {title && <h2 className="text-lg font-medium text-center mb-2">{title}</h2>}
      <div className="space-y-2 text-sm text-neutral-700">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}