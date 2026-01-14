import { Button } from "../ui/button";

export const GameConnectionError = ({ error, onBack }: { error: string; onBack: () => void }) => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">😵</span>
          </div>
          <h2 className="text-xl font-black text-slate-700">Connection Error</h2>
          <p className="text-slate-500 text-lg">{error}</p>
          <Button variant="primary" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </div>
    </>
  );
};
