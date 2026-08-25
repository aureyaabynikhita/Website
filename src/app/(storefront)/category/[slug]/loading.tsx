export default function CategoryLoading() {
  return (
    <div className="section-container section-spacing animate-pulse">
      {/* Category Header Skeleton */}
      <div className="mb-10 space-y-2">
        <div className="h-3 w-16 bg-gold/40 rounded-xs" />
        <div className="h-10 w-48 bg-charcoal/15 rounded-xs" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-beige/60 border border-charcoal/5 rounded-xs flex-shrink-0" />
        ))}
      </div>

      {/* Product Cards Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="relative aspect-[3/4] w-full bg-beige/50 border border-charcoal/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/50 to-transparent animate-luxury-shimmer" />
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-3.5 w-3/4 bg-charcoal/15 rounded-xs" />
              <div className="h-3 w-1/3 bg-charcoal/20 rounded-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
