import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft } from 'lucide-react';

const NameStage = ({ battleName, setBattleName, handleContinueToCharacter, handleBackToIntro, isLoading }: { battleName: string; setBattleName: (name: string) => void; handleContinueToCharacter: () => void; handleBackToIntro: () => void; isLoading: boolean }) => (
  <div className="flex flex-col justify-center px-1">
    <Input
      value={battleName}
      onChange={(e) => setBattleName(e.target.value)}
      placeholder="Enter your battle name"
      disabled={isLoading}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && battleName.trim()) {
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
        className='w-full'
      >
        Continue
      </Button>
      <Button
        variant="ghost"
        className="w-full text-slate-500"
        onClick={handleBackToIntro}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>
    </div>
  </div>
);

export { NameStage };