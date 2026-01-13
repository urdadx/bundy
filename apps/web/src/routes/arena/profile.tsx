import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/arena/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/arena/profile"!</div>;
}
