import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AudioSettingsContextType {
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  setSoundEffectsEnabled: (enabled: boolean) => void;
}

const AudioSettingsContext = createContext<AudioSettingsContextType | undefined>(undefined);

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wordsearch-music-enabled");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });

  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wordsearch-sound-effects-enabled");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wordsearch-music-enabled", JSON.stringify(musicEnabled));
    }
  }, [musicEnabled]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wordsearch-sound-effects-enabled", JSON.stringify(soundEffectsEnabled));
    }
  }, [soundEffectsEnabled]);

  return (
    <AudioSettingsContext.Provider value={{ 
      musicEnabled, 
      soundEffectsEnabled, 
      setMusicEnabled, 
      setSoundEffectsEnabled 
    }}>
      {children}
    </AudioSettingsContext.Provider>
  );
}

export function useAudioSettings() {
  const context = useContext(AudioSettingsContext);
  if (context === undefined) {
    throw new Error("useAudioSettings must be used within an AudioSettingsProvider");
  }
  return context;
}