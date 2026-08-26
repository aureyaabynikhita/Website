"use client";

import { useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Plus, ExternalLink, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface Review {
  id: string;
  customerName: string;
  location: string;
  productName: string;
  productSlug: string;
  rating: number;
  date: string;
  comment: string;
  status: "approved" | "pending" | "hidden";
  verified: boolean;
  featuredOnHome: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    customerName: "Priyanka S.",
    location: "Mumbai, India",
    productName: "Zoya cherry red",
    productSlug: "zoya-cherry-red",
    rating: 5,
    date: "August 20, 2026",
    comment: "The drape and craftsmanship are truly world-class. Wore it to a wedding reception and received countless compliments on the fluid silhouette.",
    status: "approved",
    verified: true,
    featuredOnHome: true,
  },
  {
    id: "rev-2",
    customerName: "Meera Kapoor",
    location: "Delhi, India",
    productName: "Mooh ivory",
    productSlug: "mooh-ivory",
    rating: 5,
    date: "August 18, 2026",
    comment: "Sublime fabric quality and the fit is perfection. The quiet luxury aesthetic is unmatched. Definitely my go-to brand for festive occasions.",
    status: "approved",
    verified: true,
    featuredOnHome: true,
  },
  {
    id: "rev-3",
    customerName: "Ananya Desai",
    location: "Bengaluru, India",
    productName: "Nazakat black",
    productSlug: "nazakat-black",
    rating: 5,
    date: "August 15, 2026",
    comment: "Heirloom piece. Extremely flattering modern cut with royal elegance. The fabric feel is exceptional.",
    status: "approved",
    verified: true,
    featuredOnHome: true,
  },
  {
    id: "rev-4",
    customerName: "Rhea Sharma",
    location: "Dubai, UAE",
    productName: "Ada cherry red",
    productSlug: "ada-cherry-red",
    rating: 5,
    date: "August 12, 2026",
    comment: "Beautiful drape skirt set, fabric feels ultra premium. Fast dispatch and exquisite packaging.",
    status: "approved",
    verified: true,
    featuredOnHome: false,
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isAdding, setIsAdding] = useState(false);

  // New review form
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("Mumbai");
  const [newProduct, setNewProduct] = useState("ZOYA cherry red");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const handleToggleStatus = (id: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, status: r.status === "approved" ? "hidden" : "approved" } : r
      )
    );
    toast.success("Review visibility updated");
  };

  const handleToggleFeatured = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, featuredOnHome: !r.featuredOnHome } : r))
    );
    toast.success("Homepage showcase status updated");
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast.success("Review deleted");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      toast.error("Please enter customer name and review comment.");
      return;
    }
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      customerName: newName,
      location: newLocation,
      productName: newProduct,
      productSlug: newProduct.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      rating: newRating,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      comment: newComment,
      status: "approved",
      verified: true,
      featuredOnHome: true,
    };
    setReviews([newRev, ...reviews]);
    setIsAdding(false);
    setNewName("");
    setNewComment("");
    toast.success("Client review added & featured on store!");
  };

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-charcoal/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Customer Reviews & Atelier Testimonials</h1>
          <p className="text-sm text-charcoal/50 mt-1">
            Moderate, approve, and feature client reviews across product pages and the homepage.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="bg-burgundy text-ivory text-xs uppercase tracking-wider font-semibold"
        >
          <Plus size={14} /> {isAdding ? "Cancel" : "Add Client Testimonial"}
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-ivory border border-charcoal/10 p-4 shadow-xs">
          <p className="text-2xs uppercase tracking-wider text-charcoal/50 font-semibold">Total Reviews</p>
          <p className="font-serif text-2xl text-charcoal mt-1">{reviews.length}</p>
        </div>
        <div className="bg-ivory border border-gold/30 bg-gold/5 p-4 shadow-xs">
          <p className="text-2xs uppercase tracking-wider text-gold-dark font-semibold">Average Rating</p>
          <p className="font-serif text-2xl text-gold-dark mt-1 flex items-center gap-1">
            5.0 <Star size={18} className="fill-gold text-gold" />
          </p>
        </div>
        <div className="bg-ivory border border-success/30 bg-success/5 p-4 shadow-xs">
          <p className="text-2xs uppercase tracking-wider text-success font-semibold">Approved & Live</p>
          <p className="font-serif text-2xl text-success mt-1">
            {reviews.filter((r) => r.status === "approved").length}
          </p>
        </div>
        <div className="bg-ivory border border-charcoal/10 p-4 shadow-xs">
          <p className="text-2xs uppercase tracking-wider text-charcoal/50 font-semibold">Featured on Home</p>
          <p className="font-serif text-2xl text-burgundy mt-1">
            {reviews.filter((r) => r.featuredOnHome).length}
          </p>
        </div>
      </div>

      {/* Add Review Form */}
      {isAdding && (
        <form onSubmit={handleAddReview} className="bg-ivory border-2 border-burgundy/30 p-6 space-y-4 shadow-lg">
          <div className="border-b border-charcoal/10 pb-3">
            <h2 className="font-serif text-lg text-charcoal">Add Client Feedback / WhatsApp Review</h2>
            <p className="text-xs text-charcoal/50 mt-0.5">Publish client testimonials received via Instagram or WhatsApp.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Client Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Radhika Singhania"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai, India"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                Garment Product
              </label>
              <select
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              >
                <option value="ZOYA cherry red">ZOYA cherry red</option>
                <option value="ZOYA black">ZOYA black</option>
                <option value="MOOH IVORY">MOOH IVORY</option>
                <option value="NAZAKAT BLACK">NAZAKAT BLACK</option>
                <option value="ROOH SKY BLUE">ROOH SKY BLUE</option>
                <option value="ROOH BEIGE">ROOH BEIGE</option>
                <option value="Ada cherry red">Ada cherry red</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Customer Testimonial / Feedback
            </label>
            <textarea
              rows={3}
              placeholder="Enter what the customer loved about the fabric, drape, and silhouette..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-2.5 text-sm text-charcoal focus:border-burgundy focus:outline-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdding(false)}
              className="text-xs uppercase"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-burgundy text-ivory text-xs uppercase font-semibold">
              Publish Review
            </Button>
          </div>
        </form>
      )}

      {/* Reviews Table */}
      <div className="bg-ivory border border-charcoal/10 overflow-x-auto shadow-xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="p-4">Customer</th>
              <th className="p-4">Product</th>
              <th className="p-4">Rating & Review</th>
              <th className="p-4">Home Showcase</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-charcoal/[0.01]">
                <td className="p-4">
                  <div className="font-semibold text-charcoal">{r.customerName}</div>
                  <div className="text-2xs text-charcoal/50">{r.location}</div>
                  <div className="text-2xs text-charcoal/40 font-mono mt-0.5">{r.date}</div>
                </td>
                <td className="p-4 font-medium text-charcoal/80">
                  <a
                    href={`/product/${r.productSlug}`}
                    target="_blank"
                    className="hover:text-burgundy hover:underline flex items-center gap-1"
                  >
                    {r.productName} <ExternalLink size={12} />
                  </a>
                </td>
                <td className="p-4 max-w-md">
                  <div className="flex text-gold mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < r.rating ? "fill-gold text-gold" : "text-charcoal/20"}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-light">{r.comment}</p>
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(r.id)}
                    className={`text-xs font-semibold px-2.5 py-1 border transition-colors ${
                      r.featuredOnHome
                        ? "bg-burgundy text-ivory border-burgundy"
                        : "bg-charcoal/5 text-charcoal/50 border-charcoal/20"
                    }`}
                  >
                    {r.featuredOnHome ? "★ Featured" : "Standard"}
                  </button>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                      r.status === "approved"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-charcoal/10 text-charcoal/50 border-charcoal/20"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(r.id)}
                      className="p-1.5 text-charcoal/60 hover:text-burgundy transition-colors"
                      title={r.status === "approved" ? "Hide" : "Approve"}
                    >
                      {r.status === "approved" ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-error hover:bg-error/10 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
