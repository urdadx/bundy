import { Button } from "../ui/button";
import GithubIcon from "@/assets/github.svg";
import { GithubStar } from "../ui/github-icon";

export const GithubStarComponent = () => {
	return (
		<div className="w-full">
			<div className="bg-white border-2 border-slate-200 rounded-3xl p-6 relative overflow-hidden">
				<div className="absolute -left-4 -bottom-4 w-24 h-24 bg-sky-50 rounded-full border-4 border-sky-100 opacity-50" />

				<div className="flex flex-col items-center gap-3 relative z-10">
					<h3 className="text-lg flex items-center gap-2 font-semibold text-slate-700 uppercase tracking-tight">
						<GithubStar />
						Help us grow bundy
					</h3>

					<Button
						className="w-full h-12 bg-white border-3 border-slate-200 border-b-4 text-slate-600 font-black uppercase hover:bg-slate-50 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-3"
						onClick={() =>
							window.open("https://github.com/urdadx/bundy", "_blank")
						}>
						<img
							src={GithubIcon}
							alt=""
							width={24}
							height={24}
							aria-hidden="true"
						/>
						Star on GitHub
					</Button>
				</div>
			</div>
		</div>
	);
};
