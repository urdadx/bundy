import { cn } from "@/lib/utils";
import diamondIcon from "@/assets/icons/diamond.svg";
import xpIcon from "@/assets/icons/xp.svg";
import { leagueAssets } from "../layouts/league-progress";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import RankingIcon from "@/assets/icons/ranking.png";

interface StatCardProps {
  label: string;
  value: string | number;
  iconSrc: string;
  colorClass: string;
}

const StatCard = ({ label, value, iconSrc, colorClass }: StatCardProps) => (
  <div className="flex items-center gap-4 bg-white border-2 border-slate-200  rounded-xl p-5">
    <div className={cn("size-14 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
      <img src={iconSrc} alt={label} className="size-10 object-contain" />
    </div>

    <div className="flex flex-col space-y-1">
      <span className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">
        {value}
      </span>
      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  </div>
);

export const ProfileStatistics = () => {
  const { data: userStats } = useQuery(trpc.user.getStats.queryOptions());
  const { data: userRank } = useQuery(trpc.user.getUserRank.queryOptions());
  const points = userStats?.totalXp || 10;
  const diamonds = userStats?.diamonds || 0;
  const league = userStats?.league || "Bronze";
  const rank = userRank?.rank;

  const stats = [
    {
      label: "XP Earned",
      value: points,
      iconSrc: xpIcon,
      colorClass: "bg-amber-100/50",
    },
    {
      label: "Diamonds",
      value: diamonds,
      iconSrc: diamondIcon,
      colorClass: "bg-sky-100/50",
    },
    {
      label: "Current Rank",
      value: rank ? `#${rank}` : "#--",
      iconSrc: RankingIcon,
      colorClass: "bg-rose-100/50",
    },
    {
      label: "League",
      value: league,
      iconSrc: leagueAssets[league as keyof typeof leagueAssets].img,
      colorClass: "bg-slate-100/50",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-2 space-y-3">
      <h2 className="text-xl font-semibold text-slate-800 capitalize tracking-tight ">
        Your Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            iconSrc={stat.iconSrc}
            colorClass={stat.colorClass}
          />
        ))}
      </div>
    </div>
  );
};
