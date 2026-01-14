import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import EinsteinImage from "@/assets/einstein.png";

const factsByTheme: Record<string, string[]> = {
  animals: [
    "Octopuses have three hearts and blue blood!",
    "A group of flamingos is called a 'flamboyance'!",
    "Elephants are the only animals that can't jump!",
    "A giraffe's tongue can be up to 20 inches long!",
    "Dolphins sleep with one eye open!",
    "Penguins propose to their mates with a pebble!",
    "A shrimp's heart is in its head!",
    "Butterflies taste with their feet!",
    "A lion's roar can be heard from 5 miles away!",
    "Sea otters hold hands while they sleep",
    "A housefly hums in the key of F!",
    "Crocodiles cannot stick their tongues out!",
    "A snail can sleep for three years!",
    "Starfish don't have brains!",
  ],
  food: [
    "Bananas are berries, but strawberries aren't!",
    "Peanuts aren't nuts - they're legumes!",
    "Carrots were originally purple!",
    "Ketchup was sold as medicine in the 1830s!",
    "Potatoes can be grown in space!",
    "Chocolate was once used as currency!",
    "The popsicle was invented by an 11-year-old boy!",
    "Apples float in water because they're 25% air!",
    "The most expensive pizza costs $12,000!",
    "Nutella was invented during WWII due to shortages!",
    "Ancient Romans used mouse brains as toothpaste!",
    "The world's largest onion weighed over 18 pounds!",
    "Broccoli is man-made ",
  ],
  science: [
    "A single bolt of lightning contains enough energy to toast 100,000 slices of bread!",
    "Venus is the hottest planet in our solar system, even though Mercury is closer to the Sun!",
    "The human brain uses about 20% of the body's total energy",
    "A day on Venus is longer than its year!",
    "The Great Barrier Reef is the largest living structure on Earth and can be seen from space!",
    "Water can boil and freeze at the same time in a phenomenon called the 'triple point'",
    "The human eye can distinguish about 10 million different colors!",
    "Your bones are stronger than steel pound for pound!",
    "Lightning strikes the Earth about 100 times per second!",
    "The Great Wall of China is not visible from space with the naked eye, despite popular belief!",
    "There are more stars in the universe than grains of sand on Earth!",
    "Glass is neither a solid nor a liquid - it's an amorphous solid!",
    "The average cloud weighs around 1.1 million pounds despite floating in the sky!",
    "A day on Jupiter is only 9 hours and 55 minutes long!",
    "The human body produces enough heat in 30 minutes to boil half a gallon of water!",
  ],
  vocabulary: [
    "There are more possible games of chess than atoms in the observable universe!",
    "The shortest war in history was between Britain and Zanzibar in 1896 - it lasted only 38 minutes!",
    "A 'pangram' is a sentence that contains every letter of the alphabet!",
    "The word 'set' has the most definitions in the English language!",
    "The longest word in English has 189,819 letters and takes 3.5 hours to pronounce!",
    "The word 'avocado' comes from the Aztec word for 'testicle'!",
    "The phrase 'break a leg' means 'good luck' in theater!",
    "The word 'nerd' was first coined by Dr. Seuss in 1950!",
    "There's a word for the fear of long words: 'hippopotomonstrosesquippedaliophobia'!",
    "The dot over the letter 'i' is called a 'tittle'!",
    "The word 'emoji' comes from Japanese words meaning 'picture' and 'character'!",
    "The word 'goodbye' comes from 'God be with ye'!",
    "The most commonly used letter in English is 'E'!",
    "The word 'alphabet' comes from the first two Greek letters: alpha and beta!",
    "The word 'deadline' originally referred to the perimeter of a prison!",
  ],
  sports: [
    "A formula 1 car can drive upside down if it goes fast enough due to the downforce it generates!",
    "The marathon was originally 26 miles because of the ancient Greek story of Pheidippides!",
    "Basketball was invented by a gym teacher trying to keep athletes in shape during winter!",
    "Golf balls have dimples because they reduce air resistance and help them fly further!",
    "The Olympics used to award medals for art, literature, and music!",
    "Baseball umpires used to sit in rocking chairs behind home plate!",
    "The first soccer balls were made from inflated pig bladders!",
    "Tennis was originally played with bare hands before rackets were invented!",
    "The longest tennis match lasted 11 hours and 5 minutes!",
    "The Olympic rings represent the five continents that participate in the games!",
    "Synchronized swimming was originally called 'water ballet'!",
    "The first hockey pucks were frozen cow patties!",
    "The Tour de France riders burn enough calories for 40 cheeseburgers per day!",
    "The highest scoring NBA game had 370 total points!",
    "The first marathon runner died at the finish line!",
  ],
  countries: [
    "The Amazon River contains 20% of the world's freshwater and has no bridges crossing it!",
    "Canada has more lakes than the rest of the world combined!",
    "Russia spans 11 time zones!",
    "Vatican City is the smallest country in the world - it's only 110 acres!",
    "Libya is the only country with a single-colored flag - it's completely green!",
    "The Philippines consists of over 7,000 islands!",
    "Greenland is the world's largest island that's not a continent!",
    "Australia is wider than the moon!",
    "The shortest border between two countries is only 85 meters long!",
    "There are 195 countries in the world today!",
    "Alaska is both the westernmost and easternmost state in the US!",
    "Iceland has no mosquitoes!",
    "The most peaceful country in the world is Iceland!",
    "France is the most visited country in the world!",
    "Sudan has more pyramids than Egypt!",
  ],
};

interface GameTipsProps {
  worldTheme?: string;
}

export const GameTips = ({ worldTheme = "animals" }: GameTipsProps) => {
  const tips = factsByTheme[worldTheme] || factsByTheme.animals;

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);

  const showNextTip = () => {
    const nextIndex = (currentTipIndex + 1) % tips.length;
    setCurrentTipIndex(nextIndex);
    setDisplayIndex(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      showNextTip();
    }, 8000);

    return () => clearInterval(interval);
  }, [currentTipIndex]);

  return (
    <div className="w-full">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6">
        <div className="flex justify-center mb-6">
          <span className="bg-slate-100 text-slate-500 text-base font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">
            {worldTheme} Facts
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <img
              className="w-24 h-24 object-contain transition-transform group-hover:scale-110"
              src={EinsteinImage}
              alt="einstein mascot"
            />
          </div>

          <div
            className="w-full relative bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-center cursor-pointer overflow-hidden"
            onClick={showNextTip}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-slate-100" />

            <AnimatePresence mode="wait">
              <motion.p
                key={displayIndex}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-sm font-bold text-slate-600 leading-relaxed"
              >
                {tips[displayIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
