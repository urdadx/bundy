import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-600" />,
        info: <InfoIcon className="size-5 text-sky-600" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-600" />,
        error: <OctagonXIcon className="size-5 text-rose-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-slate-400" />,
      }}
      toastOptions={{
        classNames: {
          // Applying chunky game styles via global or tailwind classes
          toast:
            "group flex items-center gap-3 p-4 rounded-2xl border-2 border-b-4 font-bold !bg-white",
          success: "!border-green-200 !border-b-green-500 !text-green-700",
          error: "!border-rose-200 !border-b-rose-500 !text-rose-700",
          info: "!border-sky-200 !border-b-sky-500 !text-sky-700",
          warning: "!border-amber-200 !border-b-amber-500 !text-amber-700",
          description: "font-medium text-xs opacity-80",
          actionButton: "bg-slate-800 text-white font-black rounded-xl",
          cancelButton: "bg-slate-100 text-slate-500 font-black rounded-xl",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
