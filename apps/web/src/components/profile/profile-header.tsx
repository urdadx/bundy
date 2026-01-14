import { Edit2, Calendar } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import femaleIdle from "@/assets/characters/female-idle.png";
import maleIdle from "@/assets/characters/male-idle.png";
import { normalizeAvatar } from "@/lib/avatars";

export function ProfileHeader() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";

  const normalizedAvatar = normalizeAvatar(session?.user?.image || "");
  const profileImage = normalizedAvatar.includes("jack-avatar.png") ? maleIdle : femaleIdle;

  return (
    <div className="w-full max-w-3xl mx-auto pt-2">
      <div className="relative h-48 md:h-56 bg-slate-50/50 rounded-xl border-2 border-slate-200 overflow-hidden">
        <img
          src={profileImage}
          alt=""
          className="absolute inset-0 w-full h-full object-contain p-4"
        />

        <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-xl border-2 border-slate-200 ">
          <Edit2 className="size-5 text-slate-600" />
        </button>
      </div>

      <div className="mt-3 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="text-center md:text-left space-y-1 pb-2">
            <h1 className="text-2xl font-semibold text-slate-800 capitalize tracking-tight">
              {userName}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2  text-slate-400 font-bold text-sm">
              <Calendar size={16} />
              <span>
                Joined{" "}
                {session?.user?.createdAt
                  ? new Date(session.user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
