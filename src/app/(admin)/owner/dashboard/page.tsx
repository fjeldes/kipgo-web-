'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { DollarSign, Briefcase, LogIn, LogOut } from "lucide-react";

export default function OwnerDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    api.get('/locations/owner/stats', token).then(setStats).catch(console.error);
  }, [token]);

  const cards = [
    { label: 'Revenue Today', value: stats ? `$${stats.revenue?.today?.toFixed(0) || 0}` : '—', icon: DollarSign, gradient: 'from-[#000666] to-[#1a237e]' },
    { label: 'Active Bookings', value: stats?.bookings?.activeCount ?? '—', icon: Briefcase, gradient: 'from-[#6366f1] to-[#4f46e5]' },
    { label: 'Dropoffs Today', value: stats?.dropoffs?.totalToday ?? '—', icon: LogIn, gradient: 'from-[#ff6d00] to-[#e65100]' },
    { label: 'Pickups Today', value: stats?.pickups?.totalToday ?? '—', icon: LogOut, gradient: 'from-[#22c55e] to-[#16a34a]' },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-1" style={{ color: '#1a1c1c' }}>Dashboard</h1>
      <p className="text-sm mb-8" style={{ color: '#454652' }}>Overview of your store performance</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl p-6 bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.06)]">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-4`}>
              <c.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1a1c1c' }}>{c.value}</p>
            <p className="text-sm mt-1" style={{ color: '#454652' }}>{c.label}</p>
          </div>
        ))}
      </div>

      {stats?.occupancy && (
        <div className="rounded-2xl p-8 bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.06)]">
          <h2 className="font-heading font-bold text-base mb-6" style={{ color: '#1a1c1c' }}>Capacity</h2>
          <div className="space-y-5">
            {stats.occupancy.map((o: any) => (
              <div key={o.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: '#454652' }}>{o.label}</span>
                  <span className="font-semibold" style={{ color: '#1a1c1c' }}>{o.percentage}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#eeeeee' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${o.percentage}%`, backgroundColor: o.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
