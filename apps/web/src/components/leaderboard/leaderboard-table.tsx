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
import { cn } from "@/lib/utils";
import trophyCabinet from "@/assets/rewards/trophy-cabinet.png";
import goldMedal from "@/assets/medals/gold-medal.png";
import silverMedal from "@/assets/medals/silver-medal.png";
import bronzeMedal from "@/assets/medals/bronze-medal.png";

type LeaderboardEntry = {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  status?: "online" | "idle";
  streak?: number;
};

const data: LeaderboardEntry[] = [
  {
    id: "1",
    rank: 1,
    username: "Khai đỗ đình",
    avatar: "/avatars/1.png",
    xp: 228,
    status: "online",
    streak: 100,
  },
  { id: "2", rank: 2, username: "Ishu", avatar: "/avatars/2.png", xp: 210, status: "online" },
  {
    id: "3",
    rank: 3,
    username: "Bekhzod Nurmatov",
    avatar: "/avatars/3.png",
    xp: 138,
    status: "online",
  },
  { id: "4", rank: 4, username: "Алексей", avatar: "/avatars/4.png", xp: 129, status: "online" },
  { id: "5", rank: 5, username: "Asmi Dhage", avatar: "/avatars/5.png", xp: 70 },
  { id: "6", rank: 6, username: "Phương Phạm", avatar: "/avatars/6.png", xp: 63, status: "online" },
  { id: "7", rank: 7, username: "Lecea", avatar: "/avatars/7.png", xp: 60 },
  {
    id: "8",
    rank: 8,
    username: "Kristian Panjaitan",
    avatar: "/avatars/8.png",
    xp: 58,
    status: "online",
  },
  { id: "9", rank: 9, username: "solah", avatar: "/avatars/9.png", xp: 50, status: "online" },
  {
    id: "10",
    rank: 10,
    username: "jonathanlimrs",
    avatar: "/avatars/10.png",
    xp: 46,
    status: "online",
  },
];

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
      return (
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-slate-100">
              <AvatarImage src={entry.avatar} />
              <AvatarFallback className="font-bold text-slate-400 bg-slate-100">
                {entry.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Online Status Dot */}
            {entry.status === "online" && (
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
      return (
        <div className="text-right text-base font-bold text-slate-500 pr-4">
          {row.getValue("xp")} XP
        </div>
      );
    },
  },
];

export function LeaderboardTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

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
                    // Highlight logged in user (mocking ID 1 as current user)
                    row.original.id === "1" && "bg-sky-50 hover:bg-sky-100",
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No players found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
