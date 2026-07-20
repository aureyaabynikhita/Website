"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-beige">
      <motion.div
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <Image
          src="/images/hero-main.png"
          alt="AUREYAA — New Season Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-charcoal/20" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
          className="eyebrow text-ivory/90 mb-4"
        >
          The New Season Edit
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
          className="font-serif text-4xl md:text-6xl lg:text-display-xl text-ivory max-w-3xl leading-tight"
        >
          Timeless silhouettes,
          <br />
          quietly luxurious.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="mt-8"
        >
          <Link href="/category/new-arrivals">
            <Button variant="secondary" size="lg">
              Discover the Collection
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
