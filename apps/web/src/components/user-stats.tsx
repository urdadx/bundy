import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import diamondIcon from "@/assets/icons/diamond.svg";
import xpIcon from "@/assets/icons/xp.svg";
import bronzeMedal from "@/assets/medals/bronze-medal.png";
import silverMedal from "@/assets/medals/silver-medal.png";
import goldMedal from "@/assets/medals/gold-medal.png";

const LEAGUE_MEDALS: Record<string, string> = {
  Bronze: bronzeMedal,
  Silver: silverMedal,
  Gold: goldMedal,
};

export function UserStats() {
  const { data: stats } = useQuery(trpc.user.getStats.queryOptions());

  const points = stats?.totalXp || 10;
  const diamonds = stats?.diamonds || 0;
  const league = stats?.league || "Bronze";
  const medalIcon = LEAGUE_MEDALS[league] || bronzeMedal;

  return (
    <div className="flex items-center w-full justify-between">
      <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
        <img loading="lazy" src={medalIcon} alt="League" className="w-7 h-7 object-contain" />
        <span className="text-lg font-semibold">{league}</span>
      </Button>
      <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
        <img loading="lazy" src={xpIcon} alt="XP" className="w-6 h-6 object-cover" />
        <span className="text-lg font-semibold">{points}</span>
      </Button>
      <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
        <img loading="lazy" src={diamondIcon} alt="Diamonds" className="w-6 h-6 object-cover" />
        <span className="text-lg font-semibold">{diamonds}</span>
      </Button>
    </div>
  );
}
