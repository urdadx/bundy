import { Button } from "./ui/button";
import { Input } from "./ui/input";

const NameStage = ({
  battleName,
  setBattleName,
  handleContinueToCharacter,
  isLoading,
}: {
  battleName: string;
  setBattleName: (name: string) => void;
  handleContinueToCharacter: () => void;
  handleBackToIntro?: () => void;
  isLoading: boolean;
}) => (
  <div className="flex flex-col justify-center px-1">
    <Input
      value={battleName}
      onChange={(e) => setBattleName(e.target.value)}
      placeholder="Enter your battle name"
      disabled={isLoading}
      onKeyDown={(e) => {
        if (e.key === "Enter" && battleName.trim()) {
          handleContinueToCharacter();
        }
      }}
      autoFocus
      className="mb-4"
    />
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        onClick={handleContinueToCharacter}
        disabled={!battleName.trim()}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  </div>
);

export { NameStage };
