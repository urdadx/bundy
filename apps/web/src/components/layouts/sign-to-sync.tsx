import { Button } from "../ui/button";
import { GoogleSVG } from "../ui/google-svg";

export const GoogleSyncCard = () => {
  return (
    <div className="w-full">
      <div className="bg-white border-3 border-slate-200 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-sky-50 rounded-full border-4 border-sky-100 opacity-50" />

        <div className="flex flex-col  items-center gap-3 relative z-10">
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="text-lg font-semibold text-slate-700 uppercase tracking-tight">
              Sign in to Sync Your Progress
            </h3>
          </div>

          <Button className="w-full h-12  bg-white border-3 border-slate-200 border-b-4 text-slate-600 font-black uppercase hover:bg-slate-50 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-3">
            <GoogleSVG />
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};
