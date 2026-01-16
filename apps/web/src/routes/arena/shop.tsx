import ShopPage from "@/components/shop/shop-grid";
import { createFileRoute } from "@tanstack/react-router";
import { ArenaLayout } from "@/components/layouts/arena-layout";

export const Route = createFileRoute("/arena/shop")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ArenaLayout>
      <ShopPage />
      <div className="h-24" />
    </ArenaLayout>
  );
}
