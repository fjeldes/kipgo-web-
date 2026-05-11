'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { DollarSign, CheckCircle, Clock } from "lucide-react";

export default function SuperPayouts() {
  const { token } = useAuth();
  const [payouts, setPayouts] = useState<any[]>([]);

  useEffect(() => {
    if (token) api.get<any[]>('/payouts/pending', token).then(setPayouts).catch(console.error);
  }, [token]);

  const total = payouts.reduce((s, p) => s + Number(p.totalGross), 0);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-1" style={{ color: '#1a1c1c' }}>Payouts</h1>
      <p className="text-sm mb-8" style={{ color: '#454652' }}>Manage owner payouts</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Pending', value: payouts.length, icon: Clock, gradient: 'from-[#ff6d00] to-[#e65100]' },
          { label: 'Total to pay', value: `$${total.toFixed(0)}`, icon: DollarSign, gradient: 'from-[#000666] to-[#1a237e]' },
          { label: 'Paid', value: payouts.filter(p => p.status === 'paid').length, icon: CheckCircle, gradient: 'from-[#22c55e] to-[#16a34a]' },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl p-6 bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.06)]">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-4`}>
              <c.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1a1c1c' }}>{c.value}</p>
            <p className="text-sm mt-1" style={{ color: '#454652' }}>{c.label}</p>
          </div>
        ))}
      </div>

      {payouts.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.06)]" style={{ color: '#454652' }}>
          No pending payouts
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.06)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid oklch(0 0 0 / 6%)' }}>
                <th className="p-4 text-left font-medium" style={{ color: '#454652' }}>Owner</th>
                <th className="p-4 text-left font-medium" style={{ color: '#454652' }}>Period</th>
                <th className="p-4 text-left font-medium" style={{ color: '#454652' }}>Amount</th>
                <th className="p-4 text-left font-medium" style={{ color: '#454652' }}>Status</th>
                <th className="p-4 text-left font-medium" style={{ color: '#454652' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid oklch(0 0 0 / 6%)' }}>
                  <td className="p-4 font-medium" style={{ color: '#1a1c1c' }}>{p.ownerId?.slice(0, 8)}</td>
                  <td className="p-4" style={{ color: '#454652' }}>{p.periodStart?.split('T')[0]} — {p.periodEnd?.split('T')[0]}</td>
                  <td className="p-4 font-medium" style={{ color: '#1a1c1c' }}>${Number(p.totalGross).toFixed(0)}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#fff3e0', color: '#e65100' }}>
                      Pending
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-xs font-medium" style={{ color: '#1a237e' }}>Mark as Paid</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
