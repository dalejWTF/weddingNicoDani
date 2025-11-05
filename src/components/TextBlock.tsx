// components/TextBlock.tsx
"use client";



export default function TextBlock({ title, paragraphs }: { title?: string; paragraphs: string[] }) {
  return (
    <div
      className="sm:rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {title && <h2 className="text-lg font-medium text-center mb-2 text-slate-800">{title}</h2>}
      <div className="space-y-2 text-sm text-slate-700">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
