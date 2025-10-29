// components/InfoCard.tsx
"use client";

import * as React from "react";

const SOFT_BG = "#FFFFFF";
const SOFT_ACCENT = "#8FBFD9";

export default function InfoCard({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mx-auto w-full max-w-[520px] rounded-3xl px-6 py-6"
      style={{ backgroundColor: SOFT_BG }}
    >
      {icon && (
        <div
          className="mx-auto grid size-12 place-items-center rounded-2xl shadow-sm"
          style={{ color: SOFT_ACCENT }}
        >
          {icon}
        </div>
      )}
      <div className="mt-4 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </div>
        <div className="mt-2 text-sm text-slate-700">{children}</div>
      </div>
    </div>
  );
}
