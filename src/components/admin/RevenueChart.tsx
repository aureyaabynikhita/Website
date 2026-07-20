"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-charcoal/40">
        No paid orders yet — revenue will chart here once sales come in.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke="#2E2E2E" strokeOpacity={0.06} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#2E2E2E99" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#2E2E2E99" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#FAF8F5", border: "1px solid #2E2E2E1A", fontSize: 12 }}
        />
        <Line type="monotone" dataKey="revenue" stroke="#5A1F2F" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
