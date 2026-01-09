import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "motion/react";
import { IntroStage } from "./intro-stage";
import { NameStage } from "./name-stage";
import { CharacterStage } from "./character-stage";
import femaleAvatar from "@/assets/avatars/marie-avatar.png";
import maleAvatar from "@/assets/avatars/jack-avatar.png";
import { DialogContent, DialogHeader } from "./ui/dialog";

export const AuthForm = () => {
  const [step, setStep] = useState<"intro" | "name" | "character">("intro");
  const [direction, setDirection] = useState(0);

  const [battleName, setBattleName] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<"male" | "female" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/worlds",
    });
  };

  const handlePlayAsGuest = () => {
    setDirection(1);
    setStep("name");
  };

  const handleContinueToCharacter = () => {
    if (!battleName.trim()) return;
    setDirection(1);
    setStep("character");
  };

  const handleBackToName = () => {
    setDirection(-1);
    setStep("name");
  };

  const handleBackToIntro = () => {
    setDirection(-1);
    setStep("intro");
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

      await authClient.updateUser({
        name: battleName.trim(),
        image: selectedCharacter === "male" ? maleAvatar : femaleAvatar,
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

  const getTitle = (step: "intro" | "name" | "character") => {
    switch (step) {
      case "intro":
        return "READY TO BATTLE?";
      case "name":
        return "Set a name";
      case "character":
        return "Your character";
      default:
        return "READY TO BATTLE?";
    }
  };

  const getContainerHeight = () => {
    switch (step) {
      case "intro":
        return 120;
      case "name":
        return 185;
      case "character":
        return 270;
      default:
        return 120;
    }
  };

  return (
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
          {step === "intro" ? (
            <motion.div
              key="intro"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col justify-center gap-4 px-1"
            >
              <IntroStage
                handleGoogleSignIn={handleGoogleSignIn}
                handlePlayAsGuest={handlePlayAsGuest}
              />
            </motion.div>
          ) : step === "name" ? (
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
                handleBackToIntro={handleBackToIntro}
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
  );
};
