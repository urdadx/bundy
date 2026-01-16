import { useRef, useEffect } from "react";

export function useBackgroundAudio(audioPath: string, isActive: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize context and load file
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initAudio = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (
            window.AudioContext || (window as any).webkitAudioContext
          )();
        }

        const response = await fetch(audioPath);
        const arrayBuffer = await response.arrayBuffer();
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);

        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = 0.3;
        gainNodeRef.current.connect(audioContextRef.current.destination);
      } catch (error) {
        console.error("Failed to load background audio:", error);
      }
    };

    initAudio();

    return () => {
      stopAudio();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [audioPath]);

  const stopAudio = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch (e) {
        /* Ignore */
        console.warn("Error stopping audio source:", e);
      }
      sourceRef.current = null;
    }
  };

  const startAudio = () => {
    if (!audioContextRef.current || !audioBufferRef.current || !gainNodeRef.current) return;
    if (sourceRef.current) return; // Already playing

    sourceRef.current = audioContextRef.current.createBufferSource();
    sourceRef.current.buffer = audioBufferRef.current;
    sourceRef.current.loop = true;
    sourceRef.current.connect(gainNodeRef.current);
    sourceRef.current.start(0);
  };

  // Sync with isActive state
  useEffect(() => {
    if (isActive && audioContextRef.current?.state === "running") {
      startAudio();
    } else {
      stopAudio();
    }
  }, [isActive]);

  return {
    play: async () => {
      if (!audioContextRef.current) return;

      // Crucial: resume() must be called inside the user gesture handler
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      if (isActive) {
        startAudio();
      }
    },
    pause: () => {
      if (audioContextRef.current?.state === "running") {
        audioContextRef.current.suspend();
      }
    },
  };
}
