import { searchProducts } from "@/services/products";
import { ProductCard } from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="section-container section-spacing">
      <p className="eyebrow mb-2">Search</p>
      <h1 className="font-serif text-display-sm md:text-display-md text-charcoal mb-2">
        {query ? `Results for "${query}"` : "Search AUREYAA"}
      </h1>
      <p className="text-sm text-charcoal/50 mb-10">{results.length} products found</p>

      {results.length === 0 ? (
        <p className="text-charcoal/50 text-sm">
          {query
            ? "No matches — try a different term (e.g. gown, saree, jacket, silk)."
            : "Enter a search term in the header to get started."}
        </p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
