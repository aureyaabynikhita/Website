"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FileText,
  Megaphone,
  Layout,
  Plus,
  Save,
  Trash2,
  ExternalLink,
  BookOpen,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    slug: "philosophy-of-quiet-luxury",
    title: "The Philosophy of Quiet Luxury in Indo-Western Style",
    category: "Design Story",
    date: "July 18, 2026",
    excerpt: "Exploring the rise of contemporary styling, clean lines, and understated elegance in heritage-inspired outfits.",
    image: "/images/products/prod-rooh-beige/prod-rooh-beige-01.png",
  },
  {
    id: 2,
    slug: "caring-for-silks-zari",
    title: "How to Care for Your Heirloom Silks and Zari",
    category: "Craftsmanship",
    date: "June 25, 2026",
    excerpt: "A comprehensive guide on maintaining and storing your luxury fabrics to ensure their beauty lasts for generations.",
    image: "/images/products/prod-ada-cherry-red/prod-ada-cherry-red-01.png",
  },
  {
    id: 3,
    slug: "building-timeless-wardrobe",
    title: "Minimalism: Building a Timeless Ethnic Wardrobe",
    category: "Style Guide",
    date: "May 14, 2026",
    excerpt: "How to select versatile contemporary silhouettes and co-ord sets that transcend seasonal trends.",
    image: "/images/products/prod-naira-black/prod-naira-black-01.png",
  },
];

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<"announcement" | "hero" | "journal" | "policies">("announcement");
  const [isSaving, setIsSaving] = useState(false);

  // Announcement Bar State
  const [announcementText, setAnnouncementText] = useState(
    "COMPLIMENTARY PAN-INDIA FREE SHIPPING ON ALL ORDERS • CASH ON DELIVERY AVAILABLE"
  );
  const [announcementActive, setAnnouncementActive] = useState(true);

  // Hero Section State
  const [heroHeading, setHeroHeading] = useState("Quiet Luxury, Tailored for Modern Royalty");
  const [heroSubheading, setHeroSubheading] = useState(
    "Handcrafted Indo-Western drape sarees, fluid co-ords, and structured statement jackets made from pure heirloom silks."
  );
  const [heroCtaText, setHeroCtaText] = useState("Explore New Arrivals");
  const [heroCtaLink, setHeroCtaLink] = useState("/category/new-arrivals");

  // Journal Articles State
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Design Story");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleSaveAnnouncement = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Announcement bar updated across storefront!");
    }, 500);
  };

  const handleSaveHero = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Homepage Hero content saved successfully!");
    }, 500);
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter an article title.");
      return;
    }
    const newArticle: Article = {
      id: Date.now(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: newTitle,
      category: newCategory,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      excerpt: newExcerpt || "Discover exclusive design insights from the atelier of Nikhita Matania.",
      image: newImageUrl || "/images/products/prod-rooh-beige/bb9b9409-5484-4863-8a39-ffde0b674390.jpg",
    };
    setArticles([newArticle, ...articles]);
    setNewTitle("");
    setNewExcerpt("");
    setNewImageUrl("");
    toast.success("New journal article published!");
  };

  const handleDeleteArticle = (id: number) => {
    setArticles(articles.filter((a) => a.id !== id));
    toast.success("Article removed.");
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-charcoal/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Content Management System (CMS)</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Manage storefront banners, announcement bars, journal articles, and brand storytelling.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-burgundy hover:bg-burgundy/10 px-3 py-2 border border-burgundy/20 transition-colors"
        >
          <ExternalLink size={14} /> Preview Storefront
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-charcoal/10 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("announcement")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-all ${
            activeTab === "announcement"
              ? "bg-burgundy text-ivory shadow-xs"
              : "bg-ivory text-charcoal/70 hover:text-burgundy border border-charcoal/10"
          }`}
        >
          <Megaphone size={15} /> Announcement Bar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-all ${
            activeTab === "hero"
              ? "bg-burgundy text-ivory shadow-xs"
              : "bg-ivory text-charcoal/70 hover:text-burgundy border border-charcoal/10"
          }`}
        >
          <Layout size={15} /> Hero Section
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("journal")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-all ${
            activeTab === "journal"
              ? "bg-burgundy text-ivory shadow-xs"
              : "bg-ivory text-charcoal/70 hover:text-burgundy border border-charcoal/10"
          }`}
        >
          <BookOpen size={15} /> Journal & Editorial ({articles.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("policies")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-all ${
            activeTab === "policies"
              ? "bg-burgundy text-ivory shadow-xs"
              : "bg-ivory text-charcoal/70 hover:text-burgundy border border-charcoal/10"
          }`}
        >
          <FileText size={15} /> Brand Policies
        </button>
      </div>

      {/* 1. Announcement Bar Tab */}
      {activeTab === "announcement" && (
        <div className="bg-ivory border border-charcoal/10 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <div>
              <h2 className="font-serif text-lg text-charcoal">Top Luxury Announcement Bar</h2>
              <p className="text-xs text-charcoal/50 mt-0.5">Displayed at the very top of every storefront page.</p>
            </div>
            <label className="flex items-center gap-2 text-xs uppercase font-semibold text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="h-4 w-4 accent-burgundy"
              />
              Active on Storefront
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Announcement Text
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              />
            </div>

            {/* Live Preview Bar */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-charcoal/50 font-semibold block mb-2">
                Live Storefront Preview
              </span>
              <div className="bg-burgundy text-ivory py-2 px-4 text-center border-b border-gold/20">
                <div className="flex items-center justify-center gap-2.5 text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-sans font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold" />
                  <span>{announcementText}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              onClick={handleSaveAnnouncement}
              disabled={isSaving}
              className="bg-burgundy text-ivory uppercase tracking-wider text-xs font-semibold px-6 py-2.5"
            >
              <Save size={14} /> {isSaving ? "Saving..." : "Save Announcement Bar"}
            </Button>
          </div>
        </div>
      )}

      {/* 2. Hero Section Tab */}
      {activeTab === "hero" && (
        <div className="bg-ivory border border-charcoal/10 p-6 space-y-6 shadow-xs">
          <div className="border-b border-charcoal/10 pb-3">
            <h2 className="font-serif text-lg text-charcoal">Homepage Hero Banner Content</h2>
            <p className="text-xs text-charcoal/50 mt-0.5">Primary welcoming banner for desktop and mobile visitors.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Hero Heading
              </label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none font-serif text-lg"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Subheading / Brand Statement
              </label>
              <textarea
                rows={3}
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none font-sans leading-relaxed"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                  CTA Destination URL
                </label>
                <input
                  type="text"
                  value={heroCtaLink}
                  onChange={(e) => setHeroCtaLink(e.target.value)}
                  className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              onClick={handleSaveHero}
              disabled={isSaving}
              className="bg-burgundy text-ivory uppercase tracking-wider text-xs font-semibold px-6 py-2.5"
            >
              <Save size={14} /> {isSaving ? "Saving..." : "Save Hero Section"}
            </Button>
          </div>
        </div>
      )}

      {/* 3. Journal Articles Tab */}
      {activeTab === "journal" && (
        <div className="space-y-6">
          {/* Add Article Form */}
          <div className="bg-ivory border border-charcoal/10 p-6 space-y-4 shadow-xs">
            <div className="border-b border-charcoal/10 pb-3">
              <h2 className="font-serif text-lg text-charcoal">Publish New Journal Story</h2>
              <p className="text-xs text-charcoal/50 mt-0.5">Editorial stories appear on `/journal`.</p>
            </div>

            <form onSubmit={handleAddArticle} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                    Article Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Draping: A New Era of Festive Fashion"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                    Category Tag
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
                  >
                    <option value="Design Story">Design Story</option>
                    <option value="Craftsmanship">Craftsmanship</option>
                    <option value="Style Guide">Style Guide</option>
                    <option value="Behind The Atelier">Behind The Atelier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                  Short Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary that appears on the journal grid..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  placeholder="/images/products/prod-rooh-beige/bb9b9409-5484-4863-8a39-ffde0b674390.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full border border-charcoal/20 bg-ivory p-3 text-xs font-mono text-charcoal focus:border-burgundy focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-burgundy text-ivory text-xs uppercase tracking-wider font-semibold">
                  <Plus size={14} /> Add Journal Article
                </Button>
              </div>
            </form>
          </div>

          {/* Existing Articles Table */}
          <div className="bg-ivory border border-charcoal/10 overflow-x-auto shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
                  <th className="p-4">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-charcoal/5">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative h-12 w-16 bg-beige shrink-0 overflow-hidden">
                        <Image src={article.image} alt={article.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-serif text-charcoal font-medium">{article.title}</p>
                        <p className="text-xs text-charcoal/50 line-clamp-1">{article.excerpt}</p>
                      </div>
                    </td>
                    <td className="p-4 text-charcoal/70 text-xs uppercase tracking-wider font-medium">
                      {article.category}
                    </td>
                    <td className="p-4 text-charcoal/50 text-xs font-mono">{article.date}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-error hover:text-error/80 p-1 transition-colors"
                        aria-label="Delete article"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Brand Policies Tab */}
      {activeTab === "policies" && (
        <div className="bg-ivory border border-charcoal/10 p-6 space-y-6 shadow-xs">
          <div className="border-b border-charcoal/10 pb-3">
            <h2 className="font-serif text-lg text-charcoal">Store Policies & Customer Care</h2>
            <p className="text-xs text-charcoal/50 mt-0.5">Content displayed on footer policy links.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-charcoal/10 bg-beige/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-charcoal text-sm">Shipping Policy</p>
                <p className="text-xs text-charcoal/60 mt-0.5">Complimentary Pan-India Free Shipping on all orders. 4–6 days delivery.</p>
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 border border-success/20">Active</span>
            </div>

            <div className="p-4 border border-charcoal/10 bg-beige/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-charcoal text-sm">Returns & Exchanges Policy</p>
                <p className="text-xs text-charcoal/60 mt-0.5">Hassle-free 7-day returns for unworn garments with tags intact.</p>
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 border border-success/20">Active</span>
            </div>

            <div className="p-4 border border-charcoal/10 bg-beige/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-charcoal text-sm">Privacy Policy & Terms of Service</p>
                <p className="text-xs text-charcoal/60 mt-0.5">Customer data encryption and payment security regulations.</p>
              </div>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 border border-success/20">Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
