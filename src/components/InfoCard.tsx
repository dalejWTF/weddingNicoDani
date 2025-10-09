// components/InfoCard.tsx
"use client";

import * as React from "react";

export default function InfoCard({
  icon,
  title,
  children,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "mx-auto w-full max-w-[520px] rounded-3xl border bg-white/90 px-6 py-6 shadow-lg ring-1 ring-rose-200/50 " +
        (className ?? "")
      }
    >
      {icon && (
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
          {icon}
        </div>
      )}
      <div className="mt-4 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {title}
        </div>
        <div className="mt-2 text-sm text-neutral-700">{children}</div>
      </div>
    </div>
  );
}
