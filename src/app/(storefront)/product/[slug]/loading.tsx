export default function ProductLoading() {
  return (
    <div className="section-container section-spacing animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3 w-12 bg-beige/60 rounded-xs" />
        <span className="text-charcoal/30">/</span>
        <div className="h-3 w-20 bg-beige/60 rounded-xs" />
        <span className="text-charcoal/30">/</span>
        <div className="h-3 w-28 bg-beige/80 rounded-xs" />
      </div>

      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-start">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full bg-beige/50 border border-charcoal/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/50 to-transparent animate-luxury-shimmer" />
            <div className="absolute top-4 left-4 h-5 w-20 bg-burgundy/10 rounded-xs" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-beige/40 border border-charcoal/5 rounded-xs" />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gold/30 rounded-xs" />
            <div className="h-8 w-3/4 bg-charcoal/15 rounded-xs" />
            <div className="flex items-center gap-3 pt-2">
              <div className="h-7 w-28 bg-charcoal/20 rounded-xs" />
              <div className="h-4 w-16 bg-charcoal/10 rounded-xs" />
            </div>
          </div>

          <div className="border-t border-b border-charcoal/10 py-5 space-y-3">
            <div className="h-3.5 w-32 bg-charcoal/15 rounded-xs" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-9 w-12 bg-beige/60 border border-charcoal/10 rounded-xs" />
              ))}
            </div>
          </div>

          {/* Add To Bag CTA Skeleton */}
          <div className="space-y-3 pt-2">
            <div className="h-12 w-full bg-burgundy/20 rounded-xs" />
            <div className="h-11 w-full bg-beige/60 border border-charcoal/10 rounded-xs" />
          </div>

          {/* Garment Specifications Skeleton */}
          <div className="bg-beige/20 border border-charcoal/10 p-5 space-y-4">
            <div className="h-3 w-36 bg-burgundy/20 rounded-xs" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-2.5 w-16 bg-charcoal/10 rounded-xs" />
                  <div className="h-3.5 w-24 bg-charcoal/15 rounded-xs" />
                </div>
              ))}
            </div>
          </div>

          {/* Description Lines */}
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-charcoal/10 rounded-xs" />
            <div className="h-3 w-5/6 bg-charcoal/10 rounded-xs" />
            <div className="h-3 w-4/6 bg-charcoal/10 rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
