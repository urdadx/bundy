import { WorldSelector } from "@/components/select-world";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import backgroundColorGrass from "@/assets/background/backgroundColorGrass.png";

const worldSearchSchema = z.object({
  world: z.string().default("meadow"),
});

export const Route = createFileRoute("/worlds")({
  validateSearch: (search) => worldSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${backgroundColorGrass})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <WorldSelector />
    </div>
  );
}
