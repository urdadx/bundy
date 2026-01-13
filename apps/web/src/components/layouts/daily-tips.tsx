import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import MascotImage from "@/assets/rewards/mascot.png";
import { Button } from "../ui/button";

const tips = [
  "Honey never spoils! Archaeologists have found pots dating back to ancient Egypt",
  "A single bolt of lightning contains enough energy to toast 100,000 slices of bread!",
  "Octopuses have three hearts and blue blood! ",
  "Bananas are berries, but strawberries aren't! ",
  "Venus is the hottest planet in our solar system, even though Mercury is closer to the Sun!",
  "The human brain uses about 20% of the body's total energy",
  "A day on Venus is longer than its year!",
  "The Great Barrier Reef is the largest living structure on Earth and can be seen from space!",
  "Your body produces about 25 million new cells every second - that's over 2 trillion per day!",
  "A formula 1 car can drive upside down if it goes fast enough due to downforce.",
  "The shortest war in history was between Britain and Zanzibar in 1896 - it lasted only 38 minutes!",
  "Water can boil and freeze at the same time in a phenomenon called the 'triple point'",
  "The human eye can distinguish about 10 million different colors!",
  "There are more possible games of chess than atoms in the observable universe!",
  "A group of flamingos is called a 'flamboyance'!",
  "The average cloud weighs around 1.1 million pounds despite floating in the sky!",
  "Ants don't have lungs - they breathe through tiny holes called spiracles on their bodies.",
  "The Great Wall of China is not visible from space with the naked eye, despite popular belief!",
  "Your bones are stronger than steel pound for pound!",
  "The Amazon River contains 20% of the world's freshwater and has no bridges crossing it!",
];

export const TipOfTheDay = () => {
  const getInitialTipIndex = () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("tipDate");
    const savedIndex = localStorage.getItem("tipIndex");

    let index;
    if (savedDate === today && savedIndex) {
      index = parseInt(savedIndex);
    } else {
      index = Math.floor(Math.random() * tips.length);
      localStorage.setItem("tipDate", today);
      localStorage.setItem("tipIndex", index.toString());
    }
    return index;
  };

  const [currentTipIndex, setCurrentTipIndex] = useState(() => getInitialTipIndex());
  const [displayIndex, setDisplayIndex] = useState(() => getInitialTipIndex());

  const showNextTip = () => {
    const nextIndex = (currentTipIndex + 1) % tips.length;
    setCurrentTipIndex(nextIndex);
    setDisplayIndex(nextIndex);
  };

  return (
    <div className="w-full">
      <div className="bg-white border-3 border-slate-200 rounded-3xl p-6">
        <div className="flex justify-center mb-6">
          <span className="bg-slate-100 text-slate-500 text-base font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">
            Tip of the Day
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <img
              className="w-24 h-24 object-contain transition-transform group-hover:scale-110"
              src={MascotImage}
              alt="bundy mascot"
            />
          </div>

          <div
            className="relative bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-center cursor-pointer overflow-hidden"
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

        <Button
          variant="super"
          className="w-full mt-3 h-12 text-sm font-black uppercase tracking-wider"
          onClick={showNextTip}
        >
          Next Tip
        </Button>
      </div>
    </div>
  );
};
