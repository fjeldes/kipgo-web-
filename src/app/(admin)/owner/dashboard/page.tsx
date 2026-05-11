'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Briefcase, LogIn, LogOut, TrendingUp } from "lucide-react";

export default function OwnerDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    api.get('/locations/owner/stats', token).then(setStats).catch(console.error);
  }, [token]);

  const cards = [
    { label: 'Revenue Today', value: stats ? `$${stats.revenue?.today?.toFixed(0) || 0}` : '—', icon: DollarSign, color: 'text-blue-900', bg: 'bg-blue-50' },
    { label: 'Active Bookings', value: stats?.bookings?.activeCount ?? '—', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Dropoffs Today', value: stats?.dropoffs?.totalToday ?? '—', icon: LogIn, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Pickups Today', value: stats?.pickups?.totalToday ?? '—', icon: LogOut, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Overview of your store performance</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.icon size={20} className={c.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-500 mt-1">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Occupancy */}
      {stats?.occupancy && (
        <Card>
          <CardHeader><CardTitle className="text-base">Capacity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {stats.occupancy.map((o: any) => (
              <div key={o.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{o.label}</span>
                  <span className="font-medium">{o.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${o.percentage}%`, backgroundColor: o.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
