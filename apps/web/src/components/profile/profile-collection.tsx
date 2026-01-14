import { trpc } from "@/utils/trpc";
import { Loader } from "@/components/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const ProfileCollection = () => {
  const { data: inventory, isLoading, error } = useQuery(trpc.shop.getInventory.queryOptions());

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load your collection. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 capitalize tracking-tight">
          Your Collection
        </h2>
        <button className="text-sky-500 font-black text-sm uppercase tracking-widest hover:opacity-70 transition-opacity">
          View All
        </button>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
        {inventory?.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500 font-bold">No items in your collection yet.</p>
            <p className="text-slate-400 text-sm mt-2">Visit the shop to purchase items!</p>
          </div>
        ) : (
          inventory?.map((inventoryItem, index) => (
            <div
              key={inventoryItem.id}
              className={`flex items-center gap-4 p-5 transition-colors hover:bg-slate-50 ${
                index !== (inventory?.length || 0) - 1 ? "border-b-2 border-slate-100" : ""
              }`}
            >
              <div className="size-16 flex items-center justify-center shrink-0">
                <img
                  src={
                    inventoryItem.item.image.startsWith("/rewards/")
                      ? inventoryItem.item.image
                      : inventoryItem.item.image
                  }
                  alt={inventoryItem.item.name}
                  className="size-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-black text-slate-700 truncate">
                    {inventoryItem.item.name}
                  </h3>
                  {inventoryItem.isEquipped && (
                    <span className="bg-sky-100 text-sky-600 text-xs font-black px-2 py-1 rounded-full uppercase tracking-wider">
                      Equipped
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-500 leading-tight mt-1">
                  {inventoryItem.item.description || "No description available"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
