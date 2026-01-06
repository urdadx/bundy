import { Button } from "@/components/ui/button"
import { ProgressBar } from "./progress-bar"
import planet00 from '@/assets/planets/planet00.png'
import { Link } from "@tanstack/react-router"

export function WorldProgressCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#1cb0f6] p-4 text-white sm:p-6">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 [clip-path:polygon(20%_0%,100%_0%,100%_100%,0%_100%)]" />

      <div className="relative z-10 flex flex-col gap-6">
        <div>

          <h2 className="mt-3 text-lg font-black uppercase tracking-tight sm:text-xl">
            World 1: Nebula
          </h2>
        </div>

        <div className="flex max-w-80 items-center gap-2">
          <div className="relative h-6 w-full overflow-hidden ">
            <ProgressBar value={45} color="bg-[#58cc02]" className="h-5 border-0 shadow-none" />
          </div>

        </div>

        <div className=" w-full sm:w-64">
          <Link to="/arena/battles/$battleName" params={{ battleName: "nebula" }}>
            <Button
              size="default"
              variant="secondary"
              className=" w-full rounded-2xl bg-white text-[#1cb0f6] hover:bg-slate-50  border-slate-200 active:border-b-0 active:translate-y-1"
              asChild
            >
              <span className="text-lg font-black uppercase tracking-widest">
                Continue
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden h-48 w-48 lg:flex items-center justify-center z-20">
        <div className="">
          <img src={planet00} alt="Planet" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  )
}