import { ChevronRight } from "lucide-react";
import FreezePotionImg from "@/assets/rewards/freeze-potion.png";
import GoldenHeart from "@/assets/rewards/rare-heart.png";
import RareDiamond from "@/assets/rewards/ruby.png";
import MascotSkinImg from "@/assets/rewards/wrestler.png";
import RareBracelet from "@/assets/rewards/rare-bracelets.png";
import HintBulb from "@/assets/rewards/hint.png";

interface CollectionItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

const collections: CollectionItem[] = [
  {
    id: "1",
    name: "Potion of Freeze",
    description: "Tame the cold time itself",
    image: FreezePotionImg,
  },
  {
    id: "2",
    name: "Golden Heart",
    description: "Heart of the pale queen",
    image: GoldenHeart,
  },
  {
    id: "3",
    name: "Bracelet of Cyclla",
    description: "Advance to the Gold League",
    image: RareBracelet,
  },
];

export const ProfileCollection = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 capitalize tracking-tight">
          Your Collection
        </h2>
        <button className="text-sky-500 font-black text-sm uppercase tracking-widest hover:opacity-70 transition-opacity">
          View All
        </button>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
        {collections.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-5 transition-colors hover:bg-slate-50 ${
              index !== collections.length - 1 ? "border-b-2 border-slate-100" : ""
            }`}
          >
            <div className="size-16 flex items-center justify-center shrink-0">
              <img src={item.image} alt={item.name} className="size-full object-contain" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-black text-slate-700 truncate">{item.name}</h3>
              </div>
              <p className="text-sm font-bold text-slate-500 leading-tight mt-1">
                {item.description}
              </p>
            </div>

            <div className="pl-2">
              <ChevronRight className="text-slate-300 size-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
