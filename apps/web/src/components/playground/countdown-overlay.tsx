export const CountdownOverlay = ({ countdown }: { countdown: number }) => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen backdrop-blur-sm bg-slate-900">
        <div className="flex flex-col items-center gap-6">
          <p className="text-white text-xl font-bold uppercase tracking-wide">Game Starting In</p>
          <div className="w-40 h-40 rounded-full bg-linear-to-br from-green-400 to-green-600 border-8 border-white shadow-2xl flex items-center justify-center animate-pulse">
            <span className="text-white text-7xl font-black">{countdown}</span>
          </div>
        </div>
      </div>
    </>
  );
};
