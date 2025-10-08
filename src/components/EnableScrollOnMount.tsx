// components/EnableScrollOnMount.tsx
"use client";
import { useEffect } from "react";

export default function EnableScrollOnMount() {
  useEffect(() => {
    // re-habilita scroll al montar
    document.documentElement.classList.remove("no-scroll-on-load");
    document.body.classList.remove("no-scroll-on-load");
  }, []);
  return null;
}
