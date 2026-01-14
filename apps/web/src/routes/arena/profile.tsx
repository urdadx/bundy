import { ProfileHeader } from "@/components/profile/profile-header";
import { createFileRoute } from "@tanstack/react-router";
import { ArenaLayout } from "@/components/layouts/arena-layout";
import { ProfileStatistics } from "@/components/profile/profile-stats";
import { RightSidebar } from "@/components/right-sidebar";
import { ProfileCollection } from "@/components/profile/profile-collection";

export const Route = createFileRoute("/arena/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ArenaLayout sidebar={<RightSidebar />}>
      <ProfileHeader />
      <div className="border bg-gray-200 w-full" />
      <ProfileStatistics />
      <ProfileCollection />
      <div className="h-16" />
    </ArenaLayout>
  );
}
