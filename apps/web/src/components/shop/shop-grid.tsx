import { ShopItemCard, type ShopItemType } from "./shop-item-card";
import { trpc, trpcClient } from "@/utils/trpc";
import { Loader } from "@/components/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function ShopPage() {
  const queryClient = useQueryClient();
  const { data: items, isLoading, error, refetch } = useQuery(trpc.shop.getItems.queryOptions());

  const buyItemMutation = useMutation({
    mutationFn: async (params: { itemId: string }) => {
      return trpcClient.shop.buyItem.mutate(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.shop.getItems.queryKey() });
      queryClient.invalidateQueries({ queryKey: trpc.user.getStats.queryKey() });
      toast.success(`Item Purchased!`, {
        description: "It has been added to your inventory.",
      });
    },
    onError: (error) => {
      toast.info("Insufficient diamonds", {
        description: error.message || "Unable to complete purchase",
      });
    },
  });

  const handleBuyItem = async (item: ShopItemType) => {
    try {
      await buyItemMutation.mutateAsync({ itemId: item.id });
    } catch (error) {
      console.error("Failed to buy item:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          <Loader />
          <p className="text-slate-500 font-medium">Fetching shop items</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-screen ">
        <Alert className="flex items-center " variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-lg">Failed to load shop items.</AlertDescription>
        </Alert>
        <Button variant="primary" onClick={() => refetch()} className="mx-auto">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Shop</h1>
          <p className="text-base sm:text-lg font-bold text-slate-500">
            Expand your collection by purchasing unique items!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items?.map((item) => (
          <ShopItemCard key={item.id} item={item} onBuy={handleBuyItem} />
        ))}
      </div>
    </div>
  );
}
