import { ShopItemCard, type ShopItemType } from "./shop-item-card";
import FreezePotionImg from "@/assets/rewards/freeze-potion.png";
import GoldenHeart from "@/assets/rewards/rare-heart.png";
import RareDiamond from "@/assets/rewards/ruby.png";
import MascotSkinImg from "@/assets/rewards/wrestler.png";
import RareBracelet from "@/assets/rewards/rare-bracelets.png";
import HintBulb from "@/assets/rewards/hint.png";

const MOCK_SHOP_ITEMS: ShopItemType[] = [
  {
    id: "1",
    name: "Freeze Potion",
    description: "Stop the timer for 30 seconds",
    image: FreezePotionImg,
    price: 150,
    currency: "diamonds",
    category: "powerup",
  },
  {
    id: "2",
    name: "Golden Heart",
    description: "A shiny golden heart to boost your morale",
    image: GoldenHeart,
    price: 200,
    currency: "diamonds",
    category: "powerup",
    isOwned: true,
  },
  {
    id: "3",
    name: "Ruby",
    description: "A rare and precious diamond to show off",
    image: RareDiamond,
    price: 400,
    currency: "diamonds",
    category: "bundle",
  },
  {
    id: "4",
    name: "10 Hints",
    description: "Get 10 hints to help you solve puzzles faster",
    image: HintBulb,
    price: 200,
    currency: "diamonds",
    category: "powerup",
    isOwned: true,
  },

  {
    id: "4",
    name: "Ninja Mascot Skin",
    description: "A stealthy new look for your arena avatar",
    image: MascotSkinImg,
    price: 350,
    currency: "diamonds",
    category: "cosmetic",
    isLocked: false,
  },
  {
    id: "5",
    name: "Bracelet of Wisdom",
    description: "A mystical bracelet from the ages",
    image: RareBracelet,
    price: 300,
    currency: "diamonds",
    category: "cosmetic",
    isLocked: false,
  },
];

export default function ShopPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl  font-black text-slate-800 uppercase tracking-tight">Shop</h1>
          <p className="text-lg font-bold text-slate-500">
            Browse and purchase items to enhance your gameplay experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {MOCK_SHOP_ITEMS.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            // onBuy={(boughtItem) => console.log("Bought:", boughtItem)}
          />
        ))}
      </div>
    </div>
  );
}
