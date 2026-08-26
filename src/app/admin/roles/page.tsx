"use client";

import { useState } from "react";
import { ShieldCheck, UserPlus, Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface AdminUser {
  email: string;
  name: string;
  role: "Super Admin" | "Catalog Manager" | "Fulfillment Operator";
  lastActive: string;
}

const INITIAL_ADMINS: AdminUser[] = [
  {
    email: "aureyaabynikhita@gmail.com",
    name: "Nikhita Matania",
    role: "Super Admin",
    lastActive: "Active Now",
  },
  {
    email: "nikhitamatania@gmail.com",
    name: "Nikhita Matania (Personal)",
    role: "Super Admin",
    lastActive: "Yesterday",
  },
];

export default function AdminRolesPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<AdminUser["role"]>("Catalog Manager");

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) {
      toast.error("Please provide both full name and staff email.");
      return;
    }
    setAdmins([
      ...admins,
      {
        email: newEmail.trim(),
        name: newName.trim(),
        role: newRole,
        lastActive: "Invited",
      },
    ]);
    setNewEmail("");
    setNewName("");
    toast.success(`Access invitation sent to ${newEmail}!`);
  };

  const handleRemove = (email: string) => {
    if (email === "aureyaabynikhita@gmail.com") {
      toast.error("Cannot remove primary Super Admin account.");
      return;
    }
    setAdmins(admins.filter((a) => a.email !== email));
    toast.success("Staff privileges revoked.");
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div className="border-b border-charcoal/10 pb-4">
        <h1 className="font-serif text-2xl text-charcoal">Team Roles & Security Access</h1>
        <p className="text-sm text-charcoal/50 mt-1">
          Manage staff accounts with administrative access to products, orders, and customer details.
        </p>
      </div>

      {/* Add Staff Form */}
      <form onSubmit={handleAddAdmin} className="bg-ivory border border-charcoal/10 p-6 space-y-4 shadow-xs">
        <div className="border-b border-charcoal/10 pb-3">
          <h2 className="font-serif text-lg text-charcoal">Invite Staff or Atelier Member</h2>
          <p className="text-xs text-charcoal/50 mt-0.5">Assign role-based access permissions.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Staff Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Mehta"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="rahul@aureyaa.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
              Assigned Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
            >
              <option value="Super Admin">Super Admin (Full Access)</option>
              <option value="Catalog Manager">Catalog Manager (Products & CMS)</option>
              <option value="Fulfillment Operator">Fulfillment Operator (Orders & Shipping)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-burgundy text-ivory text-xs uppercase tracking-wider font-semibold">
            <UserPlus size={14} /> Grant Staff Access
          </Button>
        </div>
      </form>

      {/* Staff List */}
      <div className="bg-ivory border border-charcoal/10 overflow-x-auto shadow-xs">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="p-4">Staff Member</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {admins.map((admin) => (
              <tr key={admin.email}>
                <td className="p-4">
                  <div className="font-semibold text-charcoal">{admin.name}</div>
                  <div className="text-xs text-charcoal/50 font-mono">{admin.email}</div>
                </td>
                <td className="p-4">
                  <span className="inline-block text-xs bg-burgundy/10 text-burgundy font-semibold px-2 py-0.5 border border-burgundy/20">
                    {admin.role}
                  </span>
                </td>
                <td className="p-4 text-xs text-charcoal/60 font-mono">{admin.lastActive}</td>
                <td className="p-4 text-right">
                  {admin.email !== "aureyaabynikhita@gmail.com" && (
                    <button
                      type="button"
                      onClick={() => handleRemove(admin.email)}
                      className="text-error hover:text-error/80 p-1 transition-colors"
                      title="Revoke access"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
