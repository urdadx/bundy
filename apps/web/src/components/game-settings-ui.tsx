import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogClose } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useColorTheme } from "@/contexts/color-theme-context";

const colorThemes = [
  { name: "Default", value: "default", color: "bg-slate-200" },
  { name: "Ocean", value: "ocean", color: "bg-cyan-200" },
  { name: "Forest", value: "forest", color: "bg-emerald-200" },
  { name: "Sunset", value: "sunset", color: "bg-orange-200" },
];

export function GameSettingsUI() {
  const [error, _setError] = useState<string | null>(null);
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <DialogContent className="border-none p-4 sm:p-6 w-200! sm:max-w-md">
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <DialogHeader className="pb-3">
          <h2 className="text-lg sm:text-xl text-center font-black text-slate-700 uppercase tracking-widest">
            Game Settings
          </h2>
        </DialogHeader>
        <div className="w-full p-2">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="font-black text-slate-700 uppercase text-sm tracking-wide">Music</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-black text-slate-700 uppercase text-sm tracking-wide">
                Color theme
              </p>
              <Select value={colorTheme} onValueChange={(value) => setColorTheme(value as any)}>
                <SelectTrigger className="w-28 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorThemes.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${theme.color}`} />
                        <span>{theme.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-black text-slate-700 uppercase text-sm tracking-wide">Sound FX</p>
              <Switch defaultChecked />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="pt-2">
              <DialogClose
                render={
                  <Button variant="primary" className="w-full text-base">
                    Save
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
