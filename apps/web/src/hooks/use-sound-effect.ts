import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useAudioSettings } from "@/contexts/audio-settings-context";

export function useSoundEffect(audioPath: string, trigger: boolean) {
  const { soundEffectsEnabled } = useAudioSettings();
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    howlRef.current = new Howl({
      src: [audioPath],
      volume: 0.5,
      preload: true,
    });

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, [audioPath]);

  useEffect(() => {
    if (!howlRef.current || !trigger || !soundEffectsEnabled) return;

    howlRef.current.play();
  }, [trigger, soundEffectsEnabled]);

  return {
    play: () => {
      if (howlRef.current && soundEffectsEnabled) {
        howlRef.current.play();
      }
    },
  };
}
