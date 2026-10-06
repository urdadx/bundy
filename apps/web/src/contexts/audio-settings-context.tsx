import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AudioSettingsContextType {
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  setSoundEffectsEnabled: (enabled: boolean) => void;
}

const AudioSettingsContext = createContext<AudioSettingsContextType | undefined>(undefined);

function getStoredBoolean(key: string): boolean {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() =>
    getStoredBoolean("wordsearch-music-enabled"),
  );

  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState<boolean>(() =>
    getStoredBoolean("wordsearch-sound-effects-enabled"),
  );

  useEffect(() => {
    try {
      localStorage.setItem("wordsearch-music-enabled", JSON.stringify(musicEnabled));
    } catch {}
  }, [musicEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem("wordsearch-sound-effects-enabled", JSON.stringify(soundEffectsEnabled));
    } catch {}
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
