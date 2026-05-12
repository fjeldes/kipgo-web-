'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function SuperBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<any[]>('/bookings', token).then(setBookings).catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold mb-2" style={{ color: '#000666' }}>All Bookings</h1>
      <p className="text-sm mb-8" style={{ color: '#454652' }}>Global view of all platform bookings</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: bookings.length, color: '#000666' },
          { label: 'Active', value: bookings.filter(b => b.status === 'confirmed' || b.status === 'in_storage').length, color: '#22c55e' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: '#6366f1' },
          { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: '#dc2626' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-6 bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
            <p className="text-sm" style={{ color: '#454652' }}>{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {bookings.length > 0 && (
        <div className="rounded-2xl bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: '#eeeeee', color: '#454652' }}>
                <th className="pb-4 px-4 pt-4">ID</th>
                <th className="pb-4 px-4 pt-4">Customer</th>
                <th className="pb-4 px-4 pt-4">Store</th>
                <th className="pb-4 px-4 pt-4">Status</th>
                <th className="pb-4 px-4 pt-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-b" style={{ borderColor: '#f3f3f3' }}>
                  <td className="py-4 px-4 font-mono text-xs" style={{ color: '#454652' }}>{b.id?.slice(0, 8)}</td>
                  <td className="py-4 px-4" style={{ color: '#1a1c1c' }}>{b.user?.profile?.firstName || b.user?.name || 'Guest'}</td>
                  <td className="py-4 px-4" style={{ color: '#454652' }}>{b.location?.name || '—'}</td>
                  <td className="py-4 px-4">{b.status}</td>
                  <td className="py-4 px-4 text-right font-medium" style={{ color: '#1a1c1c' }}>${Number(b.totalPrice).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
