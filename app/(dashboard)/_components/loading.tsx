import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar skeleton */}
      <div className="h-[80px] border-b bg-white">
        <div className="md:pl-56 px-4 h-full flex items-center">
          <Skeleton className="h-8 w-[200px]" />
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar skeleton */}
        <div className="hidden md:block w-56 border-r p-4">
          <div className="space-y-4">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-[160px]" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 p-6 md:pl-56">
          <div className="space-y-4">
            <Skeleton className="h-8 w-[300px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border">
                  <Skeleton className="h-40 w-full rounded-md" />
                  <div className="space-y-2 mt-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
