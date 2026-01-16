import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "motion/react";
import { NameStage } from "./name-stage";
import { CharacterStage } from "./character-stage";
import femaleAvatar from "@/assets/avatars/marie-avatar.png";
import maleAvatar from "@/assets/avatars/jack-avatar.png";
import { DialogContent, DialogHeader, Dialog } from "./ui/dialog";
import { env } from "@wordsearch/env/web";

export const AuthForm = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<"name" | "character">("name");
  const [direction, setDirection] = useState(0);

  const [battleName, setBattleName] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<"male" | "female" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isProduction = env.VITE_NODE_ENV === "production";

  const handleContinueToCharacter = () => {
    if (!battleName.trim()) return;
    setDirection(1);
    setStep("character");
  };

  const handleBackToName = () => {
    setDirection(-1);
    setStep("name");
  };

  const handleSubmitGuest = async () => {
    if (!battleName.trim() || !selectedCharacter) return;

    setIsLoading(true);
    try {
      await authClient.signIn.anonymous({
        fetchOptions: {
          onSuccess: () => {
            router.navigate({
              to: "/choose",
            });
          },
        },
      });

      const imageUrl = isProduction
        ? `${env.VITE_R2_BUCKET}avatars/${selectedCharacter === "male" ? "jack-avatar.png" : "marie-avatar.png"}`
        : selectedCharacter === "male"
          ? maleAvatar
          : femaleAvatar;

      await authClient.updateUser({
        name: battleName.trim(),
        image: imageUrl,
      });

      localStorage.setItem("characterGender", selectedCharacter);

      router.navigate({
        to: "/choose",
      });
    } catch (error) {
      console.error("Failed to create guest account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "90" : "-90",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "90" : "-90",
      opacity: 0,
    }),
  };

  const titleVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const getTitle = (step: "name" | "character") => {
    switch (step) {
      case "name":
        return "What's your name?";
      case "character":
        return "Your character";
      default:
        return "What's your name?";
    }
  };

  const getContainerHeight = () => {
    switch (step) {
      case "name":
        return 140;
      case "character":
        return 270;
      default:
        return 140;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h2
              key={step}
              custom={direction}
              variants={titleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-xl font-semibold uppercase text-center"
            >
              {getTitle(step)}
            </motion.h2>
          </AnimatePresence>
        </DialogHeader>
        <motion.div
          className="relative w-full overflow-hidden"
          animate={{ height: getContainerHeight() }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {step === "name" ? (
              <motion.div
                key="name"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <NameStage
                  battleName={battleName}
                  setBattleName={setBattleName}
                  handleContinueToCharacter={handleContinueToCharacter}
                  isLoading={isLoading}
                />
              </motion.div>
            ) : (
              <motion.div
                key="character"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <CharacterStage
                  selectedCharacter={selectedCharacter}
                  setSelectedCharacter={setSelectedCharacter}
                  handleSubmitGuest={handleSubmitGuest}
                  handleBackToName={handleBackToName}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
