"use client";

import { useState } from "react";
import { type UserDoc, type OrderDoc, type Address } from "@/types/firestore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/firebase/client";
import { doc, updateDoc } from "firebase/firestore";

interface AccountDashboardProps {
  profile: UserDoc;
  orders: OrderDoc[];
}

type TabType = "overview" | "orders" | "returns" | "addresses" | "profile";

export function AccountDashboard({ profile, orders }: AccountDashboardProps) {
  const [localProfile, setLocalProfile] = useState<UserDoc>(profile);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressPincode, setAddressPincode] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(localProfile.displayName || "");
  const [editPhone, setEditPhone] = useState(localProfile.phone || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const handlePasswordReset = async () => {
    setResetSent(false);
    setResetError(null);
    try {
      if (localProfile.email) {
        await sendPasswordResetEmail(auth, localProfile.email);
        setResetSent(true);
      } else {
        setResetError("No email address found associated with this account.");
      }
    } catch (err: any) {
      setResetError(err.message || "Failed to send password reset email.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const userRef = doc(db, "users", localProfile.uid);
      await updateDoc(userRef, {
        displayName: editName,
        phone: editPhone,
      });

      setLocalProfile((prev) => ({
        ...prev,
        displayName: editName,
        phone: editPhone,
      }));
      setIsEditingProfile(false);
      setProfileSuccess(true);
    } catch (err: any) {
      setProfileError(err.message || "Could not update profile details.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine1 || !addressCity || !addressState || !addressPincode || !addressPhone) {
      setAddressError("Please fill in all required fields.");
      return;
    }

    setAddressSaving(true);
    setAddressError(null);

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      label: addressLabel,
      line1: addressLine1,
      line2: addressLine2 || undefined,
      city: addressCity,
      state: addressState,
      pincode: addressPincode,
      country: "India",
      phone: addressPhone,
      isDefault: (localProfile.addresses || []).length === 0,
    };

    try {
      const userRef = doc(db, "users", localProfile.uid);
      const updatedAddresses = [...(localProfile.addresses || []), newAddress];
      
      await updateDoc(userRef, {
        addresses: updatedAddresses,
      });

      setLocalProfile((prev) => ({
        ...prev,
        addresses: updatedAddresses,
      }));

      // Reset address form
      setShowAddressForm(false);
      setAddressLine1("");
      setAddressLine2("");
      setAddressCity("");
      setAddressState("");
      setAddressPincode("");
      setAddressPhone("");
    } catch (err: any) {
      setAddressError(err.message || "Could not save address. Please try again.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const userRef = doc(db, "users", localProfile.uid);
      const updatedAddresses = (localProfile.addresses || []).filter(
        (addr) => addr.id !== addressId
      );

      await updateDoc(userRef, {
        addresses: updatedAddresses,
      });

      setLocalProfile((prev) => ({
        ...prev,
        addresses: updatedAddresses,
      }));
    } catch (err: any) {
      alert("Failed to delete address: " + err.message);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "My Orders",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: "returns",
      label: "Returns & Refunds",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
        </svg>
      ),
    },
    {
      id: "addresses",
      label: "Saved Addresses",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile & Security",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0 bg-white border border-charcoal/10 p-6 rounded-sm shadow-sm">
        <div className="mb-6 pb-6 border-b border-charcoal/10 flex items-center gap-4">
          <div className="w-12 h-12 bg-burgundy/5 text-burgundy flex items-center justify-center font-serif text-lg font-bold rounded-full border border-burgundy/10">
            {localProfile.displayName ? localProfile.displayName.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif text-md text-charcoal truncate">
                {localProfile.displayName || "Aureyaa Customer"}
              </h2>
              {localProfile.role !== "customer" && (
                <span className="bg-gold/25 text-gold-dark text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-bold font-sans rounded-sm shrink-0">
                  {localProfile.role}
                </span>
              )}
            </div>
            <p className="text-2xs text-charcoal/50 truncate">{localProfile.email}</p>
          </div>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 whitespace-nowrap px-4 py-3.5 text-left text-xs uppercase tracking-wider font-sans font-medium transition-all duration-300 border-b-2 lg:border-b-0 lg:border-l-2 ${
                activeTab === tab.id
                  ? "border-burgundy text-burgundy bg-burgundy/5 font-semibold"
                  : "border-transparent text-charcoal/60 hover:text-burgundy hover:bg-beige/10"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-charcoal/10 hidden lg:block">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 w-full bg-white border border-charcoal/10 p-6 md:p-8 rounded-sm shadow-sm min-h-[550px]">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Aureyaa Circle</span>
                <h1 className="font-serif text-display-sm text-charcoal mt-1">
                  Welcome back, {localProfile.displayName || "there"}
                </h1>
                <p className="text-xs text-charcoal/50 mt-1">
                  Track status of your orders, manage saved addresses, and update security credentials.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 self-start md:self-auto">
                {localProfile.role !== "customer" && (
                  <a
                    href="/admin/dashboard"
                    className="border border-gold bg-gold hover:bg-gold-dark text-charcoal px-4 py-2.5 text-2xs uppercase tracking-wider font-semibold font-sans transition-all duration-300 flex items-center justify-center"
                  >
                    Admin Panel
                  </a>
                )}
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setIsEditingProfile(true);
                  }}
                  className="border border-burgundy/30 text-burgundy hover:bg-burgundy hover:text-ivory px-4 py-2.5 text-2xs uppercase tracking-wider font-medium font-sans transition-all duration-300"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative overflow-hidden bg-gradient-to-br from-burgundy to-burgundy-light p-6 text-ivory rounded-sm shadow-sm hover:translate-y-[-2px] transition-transform duration-300">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-ivory">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="text-2xs uppercase tracking-widest opacity-80 font-semibold font-sans">Reward Points</span>
                <p className="font-serif text-3xl mt-2 font-light">{localProfile.rewardPoints || 0}</p>
                <p className="text-2xs mt-3 opacity-60 font-sans">Collect points on every purchase to unlock rewards.</p>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-gold to-gold-dark p-6 text-charcoal rounded-sm shadow-sm hover:translate-y-[-2px] transition-transform duration-300">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-charcoal">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
                  </svg>
                </div>
                <span className="text-2xs uppercase tracking-widest opacity-80 font-semibold font-sans">Store Credits</span>
                <p className="font-serif text-3xl mt-2 font-light">₹{localProfile.storeCredits || 0}</p>
                <p className="text-2xs mt-3 opacity-60 font-sans">Automatically applied at checkout for discounts.</p>
              </div>

              <div className="border border-charcoal/15 p-6 rounded-sm flex flex-col justify-between hover:border-burgundy/40 transition-colors duration-300">
                <div>
                  <span className="text-2xs uppercase tracking-widest text-charcoal/50 font-semibold font-sans">Total Orders</span>
                  <p className="font-serif text-3xl mt-2 text-charcoal font-light">{orders.length}</p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-burgundy font-medium hover:underline text-left mt-4 inline-flex items-center gap-1 font-sans"
                >
                  <span>Track & View Orders</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick overview of latest order */}
            <div>
              <h3 className="font-serif text-lg text-charcoal mb-4 border-b border-charcoal/10 pb-2">
                Recent Orders
              </h3>
              {orders.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-charcoal/10 bg-ivory/5 text-charcoal/50 text-xs">
                  You haven't ordered yet.{" "}
                  <a href="/new-arrivals" className="text-burgundy hover:underline font-semibold">
                    Browse New Arrivals
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="border border-charcoal/10 p-5 rounded-sm flex flex-wrap gap-4 items-center justify-between bg-beige/5 hover:border-charcoal/30 transition-colors duration-300"
                    >
                      <div className="space-y-1">
                        <p className="text-2xs uppercase tracking-wider text-charcoal/40">Order Number</p>
                        <p className="font-sans font-semibold text-xs text-charcoal">{order.orderNumber}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xs uppercase tracking-wider text-charcoal/40">Date Placed</p>
                        <p className="text-xs text-charcoal">
                          {order.createdAt?.toDate
                            ? order.createdAt.toDate().toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xs uppercase tracking-wider text-charcoal/40">Total</p>
                        <p className="font-sans font-semibold text-xs text-charcoal">₹{order.total}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xs uppercase tracking-wider text-charcoal/40">Status</p>
                        <span className={`inline-block px-2.5 py-0.5 text-2xs uppercase tracking-wider font-semibold rounded-full mt-0.5 ${
                          order.status === "delivered"
                            ? "bg-success/15 text-success"
                            : order.status === "cancelled"
                            ? "bg-error/15 text-error"
                            : "bg-gold/15 text-gold-dark"
                        }`}>
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab("orders");
                          setExpandedOrder(order.id);
                        }}
                        className="border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory px-4 py-2 text-2xs uppercase tracking-wider font-medium font-sans"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-serif text-2xl text-charcoal border-b border-charcoal/10 pb-4">
              Your Order History
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-charcoal/10 bg-ivory/5 text-charcoal/60">
                <p className="mb-4 text-sm font-serif">No purchases made yet</p>
                <a href="/new-arrivals">
                  <Button variant="primary" size="sm">Shop New Arrivals</Button>
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  return (
                    <div
                      key={order.id}
                      className="border border-charcoal/10 rounded-sm overflow-hidden bg-white hover:border-charcoal/30 transition-all duration-300"
                    >
                      <div className="bg-beige/10 p-4 md:p-6 flex flex-wrap gap-4 items-center justify-between border-b border-charcoal/10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                          <div>
                            <span className="text-2xs uppercase tracking-wider text-charcoal/40">Order Number</span>
                            <p className="text-xs font-semibold text-charcoal mt-0.5">{order.orderNumber}</p>
                          </div>
                          <div>
                            <span className="text-2xs uppercase tracking-wider text-charcoal/40">Date Placed</span>
                            <p className="text-xs text-charcoal mt-0.5">
                              {order.createdAt?.toDate 
                                ? order.createdAt.toDate().toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                  })
                                : "Recent"}
                            </p>
                          </div>
                          <div>
                            <span className="text-2xs uppercase tracking-wider text-charcoal/40">Total</span>
                            <p className="text-xs font-semibold text-charcoal mt-0.5">₹{order.total}</p>
                          </div>
                          <div>
                            <span className="text-2xs uppercase tracking-wider text-charcoal/40">Status</span>
                            <div className="mt-0.5">
                              <span className={`inline-block px-2.5 py-0.5 text-2xs uppercase tracking-wider font-semibold rounded-full ${
                                order.status === "delivered"
                                  ? "bg-success/15 text-success"
                                  : order.status === "cancelled"
                                  ? "bg-error/15 text-error"
                                  : "bg-gold/15 text-gold-dark"
                              }`}>
                                {order.status.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="text-xs text-burgundy font-medium hover:underline shrink-0"
                        >
                          {isExpanded ? "Hide Details" : "View Details & Tracking"}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="p-4 md:p-6 space-y-6 bg-white border-t border-charcoal/10">
                          {/* Items list */}
                          <div className="space-y-4">
                            <h4 className="text-2xs uppercase tracking-widest text-charcoal/40 font-bold font-sans">Garment details</h4>
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex gap-4 items-center justify-between border-b border-charcoal/5 pb-4 last:border-b-0 last:pb-0"
                              >
                                <div className="flex gap-4 items-center">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-12 h-16 object-cover border border-charcoal/10 rounded-sm shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-16 bg-beige/30 flex items-center justify-center rounded-sm border border-charcoal/10 shrink-0">
                                      <svg className="w-6 h-6 text-charcoal/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                      </svg>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs font-semibold text-charcoal">{item.title}</p>
                                    <p className="text-2xs text-charcoal/60 mt-0.5">
                                      Size: <span className="font-semibold">{item.size}</span> | Color: <span className="font-semibold">{item.color}</span> | Qty: <span className="font-semibold">{item.quantity}</span>
                                    </p>
                                  </div>
                                </div>
                                <p className="text-xs font-semibold text-charcoal">₹{item.price * item.quantity}</p>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-charcoal/10">
                            {/* Shipping address info */}
                            <div>
                              <h4 className="text-2xs uppercase tracking-widest text-charcoal/40 font-bold font-sans mb-2">Delivery Address</h4>
                              <div className="text-xs text-charcoal/80 space-y-1 bg-beige/5 p-4 border border-charcoal/10 rounded-sm">
                                <p className="font-semibold text-charcoal">{order.shippingAddress.label}</p>
                                <p>{order.shippingAddress.line1}</p>
                                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                                <p>
                                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                </p>
                                <p className="text-charcoal/50 mt-2 text-2xs">Phone: {order.shippingAddress.phone}</p>
                              </div>
                            </div>

                            {/* Summary info */}
                            <div className="bg-beige/10 p-4 border border-charcoal/10 rounded-sm space-y-2">
                              <h4 className="text-2xs uppercase tracking-widest text-charcoal/40 font-bold font-sans mb-2">Payment Summary</h4>
                              <div className="flex justify-between text-xs text-charcoal/70">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-xs text-success">
                                  <span>Discount</span>
                                  <span>-₹{order.discount}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-xs text-charcoal/70">
                                <span>Shipping Fee</span>
                                <span>₹{order.shippingFee}</span>
                              </div>
                              <div className="flex justify-between text-xs text-charcoal/70">
                                <span>Tax</span>
                                <span>₹{order.tax}</span>
                              </div>
                              <div className="flex justify-between text-xs font-semibold text-charcoal pt-2 border-t border-charcoal/10">
                                <span>Grand Total</span>
                                <span>₹{order.total}</span>
                              </div>
                              <div className="text-2xs text-charcoal/40 mt-2 font-sans">
                                Mode: <span className="uppercase font-semibold">{order.paymentMethod}</span> ({order.paymentStatus})
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* RETURNS & REFUNDS TAB */}
        {activeTab === "returns" && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-serif text-2xl text-charcoal border-b border-charcoal/10 pb-4">
              Returns & Refunds
            </h2>
            <div className="bg-beige/15 p-6 border border-charcoal/10 rounded-sm">
              <h3 className="font-serif text-md text-charcoal mb-2">Our Policy</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed mb-4">
                We accept returns and exchange requests on all tags-on, unworn products within **7 days** of delivery. You can trigger an automated email pickup request directly below.
              </p>
              <ul className="text-2xs text-charcoal/50 space-y-1 list-disc pl-4">
                <li>Pickups are conducted within 48-72 hours of approval.</li>
                <li>Refunds are credited directly to your original payment mode or as store credits.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg text-charcoal mb-4">Request a Return</h3>
              {orders.filter(o => o.status === "delivered").length === 0 ? (
                <div className="text-center py-12 border border-dashed border-charcoal/10 bg-ivory/5 text-xs text-charcoal/40">
                  No orders qualify for returns yet (only delivered orders are returnable).
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.filter(o => o.status === "delivered").map((order) => (
                    <div
                      key={order.id}
                      className="border border-charcoal/10 p-5 rounded-sm flex items-center justify-between flex-wrap gap-4 bg-beige/5 hover:border-charcoal/30 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-charcoal">{order.orderNumber}</p>
                        <p className="text-2xs text-charcoal/50">Delivered on {order.updatedAt?.toDate?.().toLocaleDateString() || "Recent"}</p>
                      </div>
                      <a href={`mailto:returns@aureyaa.in?subject=Return Request: ${order.orderNumber}&body=I would like to request return/refund for order ${order.orderNumber}. Reason for return: `}>
                        <Button variant="outline" size="sm">Initiate Request</Button>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SAVED ADDRESSES TAB */}
        {activeTab === "addresses" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-charcoal/10 pb-4">
              <h2 className="font-serif text-2xl text-charcoal">
                Saved Addresses
              </h2>
              {!showAddressForm && (
                <Button variant="primary" size="sm" onClick={() => setShowAddressForm(true)}>
                  Add New Address
                </Button>
              )}
            </div>

            {/* Add Address Form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="border border-charcoal/10 p-6 rounded-sm bg-beige/5 space-y-4">
                <h3 className="font-serif text-lg text-charcoal">Add a shipping address</h3>
                
                {addressError && <p className="text-xs text-error font-semibold">{addressError}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-2xs uppercase tracking-wider text-charcoal/50">Address Label (e.g. Home, Office)</label>
                    <input
                      type="text"
                      className="w-full border-b border-charcoal/20 bg-transparent py-2.5 text-xs focus:border-burgundy focus:outline-none"
                      value={addressLabel}
                      onChange={(e) => setAddressLabel(e.target.value)}
                      placeholder="Home / Office"
                    />
                  </div>
                  <div>
                    <label className="text-2xs uppercase tracking-wider text-charcoal/50">Recipient Phone Number*</label>
                    <input
                      type="text"
                      className="w-full border-b border-charcoal/20 bg-transparent py-2.5 text-xs focus:border-burgundy focus:outline-none"
                      value={addressPhone}
                      onChange={(e) => setAddressPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-2xs uppercase tracking-wider text-charcoal/50">Address Line 1*</label>
                  <input
                    type="text"
                    className="w-full border-b border-charcoal/20 bg-transparent py-2.5 text-xs focus:border-burgundy focus:outline-none"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Flat/House No, Building name, Street"
                    required
                  />
                </div>

                <div>
                  <label className="text-2xs uppercase tracking-wider text-charcoal/50">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    className="w-full border-b border-charcoal/20 bg-transparent py-2.5 text-xs focus:border-burgundy focus:outline-none"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Landmark, Area, Colony"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-2xs uppercase tracking-wider text-charcoal/50">City*</label>
                    <input
                      type="text"
                      className="w-full border-b border-charcoal/20 bg-transparent py-2.5 text-xs focus:border-burgundy focus:outline-none"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-2xs uppercase tracking-wider text-charcoal/50">State*</label>
                    <input
                      type="text"
                      className="w-full border-b border-charcoal/20 bg-transparent py-2.5 text-xs focus:border-burgundy focus:outline-none"
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-2xs uppercase tracking-wider text-charcoal/50">Pincode*</label>
                    <input
                      type="text"
                      className="w-full border-b border-charcoal/20 bg-transparent py-2.5 text-xs focus:border-burgundy focus:outline-none"
                      value={addressPincode}
                      onChange={(e) => setAddressPincode(e.target.value)}
                      placeholder="400050"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button type="submit" size="sm" disabled={addressSaving}>
                    {addressSaving ? "Saving..." : "Save Address"}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddressForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {localProfile.addresses && localProfile.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localProfile.addresses.map((address: Address) => (
                  <div
                    key={address.id}
                    className="border border-charcoal/10 p-5 rounded-sm relative flex flex-col justify-between bg-white hover:border-charcoal/30 transition-colors duration-300"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xs uppercase tracking-wider text-burgundy bg-burgundy/5 px-2.5 py-0.5 rounded-full font-semibold">
                          {address.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {address.isDefault && (
                            <span className="text-2xs uppercase tracking-wide text-charcoal/40 font-semibold">Default</span>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-error hover:opacity-80 p-1"
                            title="Delete Address"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
                        {address.line1}
                        {address.line2 && `, ${address.line2}`}
                      </p>
                      <p className="text-xs text-charcoal/80 font-sans">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-xs text-charcoal/80 mt-1 font-sans">Country: {address.country}</p>
                      <p className="text-2xs text-charcoal/40 mt-3 font-sans">Phone: {address.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !showAddressForm && (
                <div className="text-center py-16 text-charcoal/40 border border-dashed border-charcoal/10 bg-ivory/5 text-xs">
                  No saved addresses. Click "Add New Address" above to save one.
                </div>
              )
            )}
          </div>
        )}

        {/* PROFILE SETTINGS TAB */}
        {activeTab === "profile" && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="font-serif text-2xl text-charcoal border-b border-charcoal/10 pb-4">
              Profile & Security Settings
            </h2>

            {profileSuccess && (
              <div className="p-3 bg-success/10 text-success border border-success/20 text-xs rounded-sm">
                Profile details updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Details Form */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-charcoal border-b border-charcoal/10 pb-2 flex items-center justify-between">
                  <span>Profile details</span>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="text-xs text-burgundy font-sans hover:underline font-medium"
                    >
                      Edit details
                    </button>
                  )}
                </h3>

                {profileError && <p className="text-xs text-error font-semibold">{profileError}</p>}

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="text-2xs uppercase tracking-wider text-charcoal/50">Full Name</label>
                      <input
                        type="text"
                        className="w-full border-b border-charcoal/20 bg-transparent py-2 text-xs focus:border-burgundy focus:outline-none"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-2xs uppercase tracking-wider text-charcoal/50 font-sans">Email Address (Cannot change)</label>
                      <p className="text-xs text-charcoal/60 mt-1 font-sans">{localProfile.email}</p>
                    </div>
                    <div>
                      <label className="text-2xs uppercase tracking-wider text-charcoal/50">Phone Number</label>
                      <input
                        type="text"
                        className="w-full border-b border-charcoal/20 bg-transparent py-2 text-xs focus:border-burgundy focus:outline-none"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    <div className="flex gap-4 pt-2">
                      <Button type="submit" size="sm" disabled={profileSaving}>
                        {profileSaving ? "Saving..." : "Save Details"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setEditName(localProfile.displayName || "");
                          setEditPhone(localProfile.phone || "");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-2xs uppercase tracking-wider text-charcoal/40">Full Name</label>
                      <p className="text-sm font-semibold text-charcoal mt-0.5">{localProfile.displayName || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-2xs uppercase tracking-wider text-charcoal/40">Email Address</label>
                      <p className="text-sm font-semibold text-charcoal mt-0.5">{localProfile.email || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-2xs uppercase tracking-wider text-charcoal/40">Phone Number</label>
                      <p className="text-sm font-semibold text-charcoal mt-0.5">{localProfile.phone || "Not set"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Password & Security */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-charcoal border-b border-charcoal/10 pb-2">
                  Security Options
                </h3>
                <div className="p-5 bg-beige/10 border border-charcoal/10 rounded-sm">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal mb-2">Reset Password</h4>
                  <p className="text-xs text-charcoal/60 leading-relaxed mb-4 font-sans">
                    Trigger a secure link to update your login password. The link will be sent to <strong className="text-charcoal font-sans">{localProfile.email}</strong>.
                  </p>
                  
                  {resetSent && (
                    <p className="text-xs text-success font-semibold mb-3">
                      Password reset email sent! Check your inbox.
                    </p>
                  )}
                  {resetError && (
                    <p className="text-xs text-error font-semibold mb-3">
                      {resetError}
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePasswordReset}
                  >
                    Send Reset Link
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-charcoal/10 lg:hidden">
              <SignOutButton />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
