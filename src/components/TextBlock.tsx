// components/TextBlock.tsx
"use client";

const COLOR = "#88CFF1";

export default function TextBlock({ title, paragraphs }: { title?: string; paragraphs: string[] }) {
  return (
    <div className="sm:rounded-2xl bg-white p-5 shadow-md border" style={{ borderColor: COLOR }}>
      {title && <h2 className="text-lg font-medium text-center mb-2">{title}</h2>}
      <div className="space-y-2 text-sm text-neutral-700">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}