import BronzeReward from "@/assets/rewards/bronze-medal.png";
import SilverReward from "@/assets/rewards/silver-medal.png";
import GoldReward from "@/assets/rewards/gold-medal.png";
import { ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface LeagueProgressProps {
  league: "Bronze" | "Silver" | "Gold";
  xpNeeded: number;
}

export const leagueAssets = {
  Bronze: { img: BronzeReward, next: "Silver", color: "bg-amber-500", text: "text-amber-600" },
  Silver: { img: SilverReward, next: "Gold", color: "bg-slate-400", text: "text-slate-500" },
  Gold: { img: GoldReward, next: "Legendary", color: "bg-yellow-400", text: "text-yellow-600" },
};

export const LeagueProgress = ({ league, xpNeeded }: LeagueProgressProps) => {
  return (
    <div className="w-full">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 relative overflow-hidden group">
        <div
          className={cn(
            "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-10 transition-colors",
            leagueAssets[league].color,
          )}
        />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <h2 className={cn("text-xl font-black uppercase", leagueAssets[league].text)}>
                {league} League
              </h2>
            </div>
            <Link to="/arena/leaderboard">
              <button
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 border  border-slate-200 text-slate-400 cursor-pointer"
                type="button"
                aria-label="Go to Leaderboard"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4 bg-slate-50/50 rounded-2xl p-2 border-2 border-dashed border-slate-100">
            <img
              className="w-20 h-20 object-contain "
              src={leagueAssets[league].img}
              alt={`${league} Medal`}
            />

            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="size-4 fill-yellow-400 text-yellow-400" />
                {league === "Gold" ? (
                  <span className="text-xs font-black text-yellow-600 uppercase tracking-wide">
                    New Record
                  </span>
                ) : (
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wide">
                    Next Goal
                  </span>
                )}
              </div>
              {league === "Gold" ? (
                <p className="text-sm font-bold text-slate-600 leading-tight">
                  You have reached the pinnacle of human intelligence. Congrats!
                </p>
              ) : (
                <p className="text-sm font-bold text-slate-600 leading-tight">
                  Gain <span className="text-sky-500">{xpNeeded} XP</span> more to unlock the
                  <span className="font-black text-slate-700">
                    {" "}
                    {leagueAssets[league].next} League
                  </span>{" "}
                  rewards!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
