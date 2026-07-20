import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="font-serif text-3xl tracking-[0.15em] text-burgundy mb-10">
        AUREYAA
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
