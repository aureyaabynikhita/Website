"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  Eye,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LookItem {
  id: number;
  volume: string;
  title: string;
  description: string;
  image: string;
  categoryLink: string;
  isPublished: boolean;
}

const INITIAL_LOOKS: LookItem[] = [
  {
    id: 1,
    volume: "Volume I",
    title: "Fluid Silhouettes",
    description: "An exploration of silk drapes and fluid, unrestricted shapes designed for modern elegance.",
    image: "/images/products/prod-zoya-jacket-black/prod-zoya-jacket-black-01.jpg",
    categoryLink: "/category/co-ords",
    isPublished: true,
  },
  {
    id: 2,
    volume: "Volume II",
    title: "Contemporary Heritage",
    description: "Honoring traditional weaves through minimal structures and modern Indo-Western cuts.",
    image: "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-01.png",
    categoryLink: "/category/sarees",
    isPublished: true,
  },
  {
    id: 3,
    volume: "Volume III",
    title: "Minimalist Drape",
    description: "Quiet luxury defined. Delicate craftsmanship met with classic premium fabrications.",
    image: "/images/products/prod-ada-cherry-red/prod-ada-cherry-red-01.png",
    categoryLink: "/category/drape-skirts",
    isPublished: true,
  },
];

export default function AdminLookbookPage() {
  const [looks, setLooks] = useState<LookItem[]>(INITIAL_LOOKS);
  const [isAdding, setIsAdding] = useState(false);

  // New Look State
  const [volumeName, setVolumeName] = useState(`Volume IV`);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryLink, setCategoryLink] = useState("/category/new-arrivals");

  const handleAddLook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a collection title.");
      return;
    }
    const newLook: LookItem = {
      id: Date.now(),
      volume: volumeName || `Volume ${looks.length + 1}`,
      title,
      description: description || "Timeless Indo-Western silhouettes crafted for unforgettable celebrations.",
      image: imageUrl || "/images/products/prod-rooh-sky-blue/d09a3cf3-40e1-45da-96ba-a10c97805a81.jpg",
      categoryLink,
      isPublished: true,
    };
    setLooks([...looks, newLook]);
    setIsAdding(false);
    setTitle("");
    setDescription("");
    setImageUrl("");
    toast.success("Lookbook Volume added successfully!");
  };

  const handleDelete = (id: number) => {
    setLooks(looks.filter((l) => l.id !== id));
    toast.success("Lookbook Volume deleted.");
  };

  const handleTogglePublish = (id: number) => {
    setLooks(
      looks.map((l) => (l.id === id ? { ...l, isPublished: !l.isPublished } : l))
    );
    toast.success("Visibility updated");
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-charcoal/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Seasonal Lookbook Manager</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Curate visual editorial volumes and seasonal campaigns displayed on `/lookbook`.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/lookbook"
            target="_blank"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-burgundy hover:bg-burgundy/10 px-3 py-2 border border-burgundy/20 transition-colors"
          >
            <ExternalLink size={14} /> View Live Lookbook
          </Link>
          <Button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="bg-burgundy text-ivory text-xs uppercase tracking-wider font-semibold"
          >
            <Plus size={14} /> {isAdding ? "Cancel" : "Add Lookbook Volume"}
          </Button>
        </div>
      </div>

      {/* Add New Look Form Modal / Card */}
      {isAdding && (
        <form onSubmit={handleAddLook} className="bg-ivory border border-charcoal/15 p-6 space-y-4 shadow-sm">
          <div className="border-b border-charcoal/10 pb-3">
            <h2 className="font-serif text-lg text-charcoal">Create New Editorial Volume</h2>
            <p className="text-xs text-charcoal/50 mt-0.5">Showcase a high-fashion look with editorial photography.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Volume Label
              </label>
              <input
                type="text"
                value={volumeName}
                onChange={(e) => setVolumeName(e.target.value)}
                placeholder="e.g. Volume IV: Royal Crimson"
                className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Collection Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Regal Velvet & Organza"
                className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Editorial Story / Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the mood, silhouettes, fabrications, and artistic inspiration..."
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none font-sans"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Editorial Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/products/prod-zoya-black/0746ba11-37d4-4a41-b85a-063f25c7ba9d.jpg"
                className="w-full border border-charcoal/20 bg-ivory p-3 text-xs font-mono text-charcoal focus:border-burgundy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Linked Collection Category
              </label>
              <select
                value={categoryLink}
                onChange={(e) => setCategoryLink(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              >
                <option value="/category/new-arrivals">New Arrivals</option>
                <option value="/category/sarees">Drape Sarees</option>
                <option value="/category/co-ords">Co-Ord Sets</option>
                <option value="/category/drape-skirts">Drape Skirts</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdding(false)}
              className="text-xs uppercase font-semibold"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-burgundy text-ivory text-xs uppercase font-semibold">
              <Plus size={14} /> Add to Lookbook
            </Button>
          </div>
        </form>
      )}

      {/* Lookbook Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {looks.map((look) => (
          <div
            key={look.id}
            className="bg-ivory border border-charcoal/10 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[3/4] bg-beige/50 border-b border-charcoal/10 overflow-hidden">
                <Image src={look.image} alt={look.title} fill className="object-cover object-top" />
                <span className="absolute top-3 left-3 bg-burgundy text-ivory text-[9px] uppercase tracking-widest font-bold px-2 py-1 shadow-xs">
                  {look.volume}
                </span>
                <span
                  className={`absolute top-3 right-3 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 border shadow-xs ${
                    look.isPublished
                      ? "bg-success/90 text-ivory border-success"
                      : "bg-charcoal/80 text-ivory border-charcoal"
                  }`}
                >
                  {look.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg text-charcoal font-semibold">{look.title}</h3>
                <p className="text-xs text-charcoal/60 leading-relaxed font-light line-clamp-3">
                  {look.description}
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-charcoal/50">
                    Linked to: {look.categoryLink}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-charcoal/10 bg-beige/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleTogglePublish(look.id)}
                className="text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-burgundy transition-colors"
              >
                {look.isPublished ? "Hide from Store" : "Publish to Store"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(look.id)}
                className="text-error hover:text-error/80 p-1.5 transition-colors"
                aria-label="Delete look"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
