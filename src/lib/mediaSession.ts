// src/lib/mediaSession.ts
export type MediaArtwork = { src: string; sizes?: string; type?: string };

type MediaSessionAction =
  | "play" | "pause" | "stop"
  | "seekbackward" | "seekforward" | "seekto"
  | "previoustrack" | "nexttrack";

type MediaSessionActionDetails = {
  action: MediaSessionAction;
  seekOffset?: number;
  seekTime?: number;
  fastSeek?: boolean;
};

export function setupMediaSession(
  audio: HTMLAudioElement,
  opts: { title: string; artist?: string; album?: string; artwork?: MediaArtwork[] }
) {
  const ms = (navigator as Navigator & { mediaSession?: any }).mediaSession;
  if (!ms) return () => {};

  // Metadatos
  ms.metadata = new (window as any).MediaMetadata({
    title: opts.title,
    artist: opts.artist,
    album: opts.album,
    artwork: opts.artwork ?? [],
  });

  // Estado de reproducción
  const updatePosition = () => {
    try {
      ms.setPositionState?.({
        duration: Number.isFinite(audio.duration) ? audio.duration : 0,
        position: audio.currentTime,
        playbackRate: audio.playbackRate || 1,
      });
    } catch {}
  };

  const play = async () => { await audio.play(); };
  const pause = () => { audio.pause(); };
  const stop = () => { audio.pause(); audio.currentTime = 0; };

  const seekBy = (offset = 10) => {
    const next = Math.max(0, Math.min((audio.duration || Infinity), audio.currentTime + offset));
    audio.currentTime = next;
    updatePosition();
  };

  const onAction = (details: MediaSessionActionDetails) => {
    switch (details.action) {
      case "play": return void play();
      case "pause": return pause();
      case "stop": return stop();
      case "seekbackward": return seekBy(-(details.seekOffset ?? 10));
      case "seekforward": return seekBy(details.seekOffset ?? 10);
      case "seekto":
        if (typeof details.seekTime === "number") {
          if ((audio as any).fastSeek && details.fastSeek) (audio as any).fastSeek(details.seekTime);
          else audio.currentTime = details.seekTime;
          updatePosition();
        }
        return;
      default: return;
    }
  };

  // Handlers
  const actions: MediaSessionAction[] = [
    "play","pause","stop","seekbackward","seekforward","seekto",
    "previoustrack","nexttrack",
  ];
  actions.forEach(a => ms.setActionHandler?.(a, (d: MediaSessionActionDetails) => onAction(d)));

  // Sincronizar estado
  const onTime = () => updatePosition();
  const onRate = () => updatePosition();
  const onPlay = () => { ms.playbackState = "playing"; };
  const onPause = () => { ms.playbackState = "paused"; };
  const onEnded = () => { ms.playbackState = "none"; };

  audio.addEventListener("timeupdate", onTime);
  audio.addEventListener("ratechange", onRate);
  audio.addEventListener("play", onPlay);
  audio.addEventListener("pause", onPause);
  audio.addEventListener("ended", onEnded);

  updatePosition();

  // Limpieza
  return () => {
    actions.forEach(a => ms.setActionHandler?.(a, null));
    audio.removeEventListener("timeupdate", onTime);
    audio.removeEventListener("ratechange", onRate);
    audio.removeEventListener("play", onPlay);
    audio.removeEventListener("pause", onPause);
    audio.removeEventListener("ended", onEnded);
  };
}
