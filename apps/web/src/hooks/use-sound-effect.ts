import { useEffect, useRef } from "react";

export function useSoundEffect(audioPath: string, trigger: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

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
      } catch (error) {
        console.error("Failed to load sound effect:", error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioPath]);

  useEffect(() => {
    if (!audioContextRef.current || !audioBufferRef.current || !trigger) return;

    try {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 0.5;
      
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      source.start(0);
    } catch (error) {
      console.error("Failed to play sound effect:", error);
    }
  }, [trigger]);

  return {
    play: () => {
      if (!audioContextRef.current || !audioBufferRef.current) return;
      
      try {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        
        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = 0.5;
        
        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        source.start(0);
      } catch (error) {
        console.error("Failed to play sound effect:", error);
      }
    }
  };
}