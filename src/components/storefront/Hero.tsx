import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-beige">
      <Image
        src="/images/hero-main.png"
        alt="AUREYAA — New Season Collection"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/20" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <p className="eyebrow text-ivory/90 mb-4">The New Season Edit</p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-display-xl text-ivory max-w-3xl leading-tight">
          Timeless silhouettes,
          <br />
          quietly luxurious.
        </h1>
        <Link href="/category/new-arrivals" className="mt-8">
          <Button variant="secondary" size="lg">
            Discover the Collection
          </Button>
        </Link>
      </div>
    </section>
  );
}
