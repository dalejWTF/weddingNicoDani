// components/InfoCard.tsx
"use client";

import * as React from "react";

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
    <div className="mx-auto w-full max-w-[520px] rounded-3xl bg-white/90 px-6 py-6" >
    
      {icon && (
        <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-blue-200" >
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
