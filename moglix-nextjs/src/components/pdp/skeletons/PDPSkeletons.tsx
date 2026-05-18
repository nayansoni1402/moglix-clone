// Skeleton loader components for PDP
export function GallerySkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="hidden lg:flex flex-col gap-2 w-[80px]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full aspect-square bg-gray-2 rounded-lg" />
        ))}
      </div>
      <div className="flex-1 aspect-square bg-gray-2 rounded-xl" />
    </div>
  );
}

export function ProductInfoSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-3 bg-gray-2 rounded w-24" />
      <div className="space-y-2">
        <div className="h-5 bg-gray-2 rounded w-full" />
        <div className="h-5 bg-gray-2 rounded w-3/4" />
      </div>
      <div className="h-3 bg-gray-2 rounded w-32" />
      <div className="bg-gray-1 rounded-xl p-4">
        <div className="h-8 bg-gray-2 rounded w-40 mb-2" />
        <div className="h-3 bg-gray-2 rounded w-32" />
      </div>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-3 bg-gray-2 rounded w-full" />
        ))}
      </div>
    </div>
  );
}

export function PriceBoxSkeleton() {
  return (
    <div className="bg-white border border-gray-2 rounded-xl p-5 space-y-4 animate-pulse">
      <div className="h-7 bg-gray-2 rounded w-32" />
      <div className="h-3 bg-gray-2 rounded w-20" />
      <div className="h-10 bg-gray-2 rounded-lg w-32" />
      <div className="space-y-3">
        <div className="h-12 bg-gray-2 rounded-xl" />
        <div className="h-12 bg-gray-2 rounded-xl" />
        <div className="h-12 bg-gray-2 rounded-xl" />
      </div>
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex gap-8">
        <div className="w-64 space-y-3">
          <div className="h-16 bg-gray-2 rounded-xl" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-2 bg-gray-2 rounded w-full" />
          ))}
        </div>
        <div className="flex-1 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2 border-b border-gray-1 pb-6">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-gray-2 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-gray-2 rounded w-24" />
                  <div className="h-2 bg-gray-2 rounded w-16" />
                </div>
              </div>
              <div className="h-3 bg-gray-2 rounded w-full" />
              <div className="h-3 bg-gray-2 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
