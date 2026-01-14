import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DiamondItem from "@/assets/icons/diamond.svg";

export type ShopItemType = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  currency: "diamonds" | "coins";
  isOwned?: boolean;
  isLocked?: boolean;
  category?: "powerup" | "cosmetic" | "bundle";
};

interface ShopItemCardProps {
  item: ShopItemType;
  onBuy?: (item: ShopItemType) => void;
}

export function ShopItemCard({ item, onBuy }: ShopItemCardProps) {
  const [_isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyClick = () => {
    if (item.isOwned || item.isLocked) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onBuy?.(item);

      toast.success(`${item.name} Purchased!`, {
        description: "It has been added to your inventory.",
      });
    }, 1000);
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-3xl border-2 border-gray-200 p-4 transition-transform duration-200 ease-out",
        item.isLocked
          ? "border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed"
          : "border-slate-200 hover:-translate-y-1",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-4 right-4">
        {item.isLocked && (
          <div className="bg-slate-200 text-slate-500 p-2 rounded-full">
            <Lock size={16} />
          </div>
        )}
      </div>

      <div
        className={cn(
          "relative h-36 w-full flex items-center justify-center mb-2 rounded-2xl transition-transform duration-200",
          item.isLocked ? "grayscale" : "bg-sky-50/50",
        )}
      >
        <img
          src={item.image}
          alt={item.name}
          className="h-32 w-32 object-contain relative z-10 drop-shadow-lg"
        />
      </div>

      <div className="text-center mb-3 space-y-1">
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm font-bold text-slate-500 leading-tight line-clamp-2">
          {item.description}
        </p>
      </div>

      <Button
        onClick={handleBuyClick}
        disabled={item.isOwned || item.isLocked || isLoading}
        className={cn(
          "w-full h-12 text-base font-black uppercase tracking-wider flex items-center justify-center gap-2",
          item.isOwned
            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-default"
            : item.isLocked
              ? "bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed"
              : "bg-sky-500 hover:bg-sky-400 text-white  active:border-b-0 active:translate-y-1",
        )}
      >
        {isLoading ? (
          <span className="animate-pulse">Processing...</span>
        ) : item.isOwned ? (
          "Equipped"
        ) : item.isLocked ? (
          "Locked"
        ) : (
          <>
            <img src={DiamondItem} alt="Diamond" className="size-5 inline-block" />
            {item.price}
          </>
        )}
      </Button>
    </div>
  );
}
