// components/BackgroundAudio.tsx
"use client";

import * as React from "react";
import { Music2, Play, Pause, Volume2, VolumeX } from "lucide-react";

type Props = {
  src: string;
  title?: string;
  artist?: string;
  cover?: string;
  initialVolume?: number; // 0..1
  loop?: boolean;
  className?: string;
};

export default function BackgroundAudio({
  src,
  title = "Música de fondo",
  artist = "Daniel & Nicole",
  cover = "/assets/cover.jpg",
  initialVolume = 0.6,
  loop = true,
  className,
}: Props) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [blocked, setBlocked] = React.useState(false); // autoplay bloqueado
  const [ready, setReady] = React.useState(false);

  // Preferencia del usuario
  React.useEffect(() => {
    const pref = localStorage.getItem("bg-music");
    if (pref === "off") {
      setIsPlaying(false);
      setBlocked(true); // mostramos botón para que decida encender
    }
  }, []);

  // Monta el <audio> y prueba reproducir
  React.useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = initialVolume;
    el.muted = false;

    // Metadata para controles del SO
    if ("mediaSession" in navigator) {
      try {
        // @ts-ignore
        navigator.mediaSession.metadata = new MediaMetadata({
          title,
          artist,
          artwork: cover ? [{ src: cover, sizes: "512x512", type: "image/png" }] : [],
        });
        // @ts-ignore
        navigator.mediaSession.setActionHandler?.("play", () => play());
        // @ts-ignore
        navigator.mediaSession.setActionHandler?.("pause", () => pause());
      } catch {}
    }

    const tryAutoplay = async () => {
      try {
        await el.play();
        setIsPlaying(true);
        setBlocked(false);
        setReady(true);
      } catch {
        // Autoplay bloqueado → esperar primer gesto
        setBlocked(true);
        setReady(true);
      }
    };

    // Si el usuario no desactivó la música, intentamos autoplay
    if (localStorage.getItem("bg-music") !== "off") {
      void tryAutoplay();
    } else {
      setReady(true);
    }

    // Arrancar al primer gesto si estaba bloqueado
    const onFirstGesture = async () => {
      if (!audioRef.current) return;
      if (!isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setBlocked(false);
          window.removeEventListener("pointerdown", onFirstGesture);
          window.removeEventListener("keydown", onFirstGesture);
          window.removeEventListener("touchstart", onFirstGesture);
        } catch {}
      }
    };

    window.addEventListener("pointerdown", onFirstGesture, { once: true, passive: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    window.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const play = async () => {
    try {
      await audioRef.current?.play();
      setIsPlaying(true);
      setBlocked(false);
      localStorage.setItem("bg-music", "on");
    } catch {
      setBlocked(true);
    }
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    localStorage.setItem("bg-music", "off");
  };

  const toggle = () => (isPlaying ? pause() : play());

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        loop={loop}
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />

      {/* Control flotante minimizado */}
      <div
        className={
          "pointer-events-auto fixed bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full bg-black/60 text-white backdrop-blur px-3 py-2 shadow-lg " +
          "flex items-center gap-2 " +
          (className ?? "")
        }
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        
        <button
          onClick={toggle}
          className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"
          aria-label={isPlaying ? "" : ""}
        >
          {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          <span>{isPlaying ? "" : blocked ? "" : ""}</span>
        </button>

        <button
          onClick={toggleMute}
          className="rounded-full hover:bg-white/10"
          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
          title={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>

      {/* Mensaje accesible si estaba bloqueado (opcional) */}
      {ready && blocked && (
        <span className="sr-only">
          La reproducción automática fue bloqueada por tu navegador. Toca “Reproducir” para iniciar la música.
        </span>
      )}
    </>
  );
}
