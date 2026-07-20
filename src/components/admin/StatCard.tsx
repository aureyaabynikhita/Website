import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-ivory border border-charcoal/10 p-6 flex items-center gap-4">
      <div className="h-11 w-11 rounded-full bg-burgundy/5 flex items-center justify-center text-burgundy">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-charcoal/50">{label}</p>
        <p className="text-2xl font-serif text-charcoal mt-0.5">{value}</p>
      </div>
    </div>
  );
}
