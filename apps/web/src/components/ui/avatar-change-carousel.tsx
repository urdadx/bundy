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
    <div className="relative w-full max-w-xs mx-auto px-4 sm:px-0">
      <Carousel onIndexChange={onIndexChange}>
        <CarouselContent className="h-64 md:h-80">
          {AVATARS.map((avatar) => (
            <CarouselItem key={avatar.id} className="p-8 sm:p-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <img
                  src={avatar.src}
                  alt={avatar.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-contain p-1 sm:p-2"
                />
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
