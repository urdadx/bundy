import { useRef, useEffect } from "react";
import { Howl, Howler } from "howler";

export function useBackgroundAudio(audioPath: string, isActive: boolean) {
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    howlRef.current = new Howl({
      src: [audioPath],
      loop: true,
      volume: 0.3,
      autoplay: true,
      preload: true,
      html5: false,
      onloaderror: (id, err) => console.error("Howl Load Error:", err),
      onplayerror: (id, err) => {
        console.warn("Howl Play Error:", err);
        howlRef.current?.once("unlock", () => howlRef.current?.play());
      },
    });

    return () => {
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
      }
    };
  }, [audioPath]);

  useEffect(() => {
    if (!howlRef.current) return;

    if (isActive) {
      if (Howler.ctx && Howler.ctx.state === "suspended") {
        Howler.ctx.resume().then(() => {
          howlRef.current?.play();
        });
      } else {
        howlRef.current.play();
      }
    } else {
      howlRef.current.pause();
    }
  }, [isActive]);
}
