'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function OwnerBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<any[]>('/bookings/me', token).then(setBookings).catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold mb-2" style={{ color: '#000666' }}>Bookings</h1>
      <p className="text-sm mb-8" style={{ color: '#454652' }}>Manage all incoming and active bookings</p>

      {bookings.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)]" style={{ color: '#454652' }}>
          No bookings yet
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: '#eeeeee', color: '#454652' }}>
                <th className="pb-4 px-4 pt-4">Customer</th>
                <th className="pb-4 px-4 pt-4">Status</th>
                <th className="pb-4 px-4 pt-4">Items</th>
                <th className="pb-4 px-4 pt-4">Dates</th>
                <th className="pb-4 px-4 pt-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-b transition-colors" style={{ borderColor: '#f3f3f3' }}>
                  <td className="py-4 px-4 font-medium" style={{ color: '#1a1c1c' }}>{b.user?.profile?.firstName || b.user?.name || 'Guest'}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                      b.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                      b.status === 'in_storage' ? 'bg-blue-50 text-blue-700' :
                      b.status === 'completed' ? 'bg-gray-50 text-gray-700' : 'bg-red-50 text-red-700'
                    }`}>{b.status}</span>
                  </td>
                  <td className="py-4 px-4" style={{ color: '#454652' }}>{b.items ? `${b.items.small || 0}S ${b.items.medium || 0}M ${b.items.large || 0}L` : '—'}</td>
                  <td className="py-4 px-4" style={{ color: '#454652' }}>
                    {b.startDate ? new Date(b.startDate).toLocaleDateString() : '—'} — {b.endDate ? new Date(b.endDate).toLocaleDateString() : '—'}
                  </td>
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
