
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar skeleton */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
        <div className="p-6">
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="px-6 mb-6">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-3 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
        <div className="px-3 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <header className="flex justify-between items-center p-6 bg-gray-50">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </header>

        <main className="px-6 pb-12">
          {/* Welcome card skeleton */}
          <Skeleton className="h-40 w-full rounded-xl" />
          
          {/* Summary cards skeleton */}
          <div className="mt-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg" />
              ))}
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-72 w-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
