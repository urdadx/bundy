import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { cn } from "@/lib/utils";
import trophyCabinet from "@/assets/rewards/trophy-cabinet.png";
import goldMedal from "@/assets/medals/gold-medal.png";
import silverMedal from "@/assets/medals/silver-medal.png";
import bronzeMedal from "@/assets/medals/bronze-medal.png";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

type LeaderboardEntry = {
  id: string;
  rank: number;
  username: string;
  avatar: string | null;
  xp: number;
  isOnline?: boolean;
};

export const columns: ColumnDef<LeaderboardEntry>[] = [
  {
    accessorKey: "rank",
    header: "",
    cell: ({ row }: { row: any }) => {
      const rank = row.getValue("rank") as number;

      if (rank === 1) return <img src={goldMedal} className="w-7 h-7 object-contain" />;
      if (rank === 2) return <img src={silverMedal} className="w-7 h-7 object-contain" />;
      if (rank === 3) return <img src={bronzeMedal} className="w-7 h-7 object-contain" />;

      return (
        <div className="w-10 flex justify-center text-lg font-bold text-green-600">{rank}</div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Player",
    cell: ({ row }) => {
      const entry = row.original;
      if (!entry || !entry.username) {
        return <div className="text-slate-500">Unknown Player</div>;
      }

      return (
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-slate-100">
              <AvatarImage src={entry.avatar ?? undefined} />
              <AvatarFallback className="font-bold text-slate-400 bg-slate-100">
                {entry.username?.slice(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
            {entry.isOnline === true && (
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <span className="font-bold text-slate-700 text-sm md:text-base truncate max-w-30 md:max-w-none">
            {entry.username}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "xp",
    header: "XP",
    cell: ({ row }) => {
      const xp = row.getValue("xp");
      return (
        <div className="text-right text-base font-bold text-slate-500 pr-4">
          {typeof xp === "number" ? `${xp} XP` : "0 XP"}
        </div>
      );
    },
  },
];

export function LeaderboardTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data: profile } = useQuery(trpc.user.getProfile.queryOptions());

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isLoading } =
    useInfiniteQuery(
      trpc.user.getLeaderboard.infiniteQueryOptions(
        { limit: 10 },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        },
      ),
    );

  const allItems = data?.pages.flatMap((page) => page?.items || []) || [];
  const leaderboardData: LeaderboardEntry[] = React.useMemo(
    () =>
      allItems.map((item, index) => ({
        ...item,
        rank: index + 1,
      })),
    [allItems],
  );

  const table = useReactTable({
    data: leaderboardData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (error) {
    console.error("Leaderboard error:", error);
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 mb-10">
        <div className="text-center text-red-500">
          {error.message.includes("UNAUTHORIZED")
            ? "Please log in to view the leaderboard"
            : `Error loading leaderboard: ${error.message}`}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 mb-10">
        <div className="text-center text-slate-500">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 mb-10">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="relative">
          <img src={trophyCabinet} alt="Trophy Cabinet" className="w-40 h-40 object-contain" />
        </div>
        <h2 className="text-3xl text-balance font-black text-slate-800">Global Leaderboard</h2>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="text-slate-400 text-sm">Top players ranked by XP earned</span>
        </div>
      </div>
      <div className="border rounded-2xl overflow-hidden">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-slate-50 border-slate-100 transition-colors cursor-pointer h-20",
                    row.original.id === profile?.id && "bg-sky-50 hover:bg-sky-100",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="first:pl-6 last:pr-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-lg">
                  No players found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hasNextPage && (
        <div className="flex justify-center">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
