import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselIndicator,
} from "./carousel";
import { AVATARS } from "@/lib/avatars";

interface AvatarChangeCarouselProps {
  onIndexChange?: (index: number) => void;
}

export function AvatarChangeCarousel({ onIndexChange }: AvatarChangeCarouselProps) {
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <Carousel onIndexChange={onIndexChange}>
        <CarouselContent className="h-80">
          {AVATARS.map((avatar) => (
            <CarouselItem key={avatar.id} className="p-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <img src={avatar.src} alt={avatar.name} className="w-40 h-40 object-contain p-2" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation alwaysShow />
        <CarouselIndicator />
      </Carousel>
    </div>
  );
}
