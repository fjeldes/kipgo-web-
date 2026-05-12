'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function SuperOwners() {
  const { token } = useAuth();
  const [owners, setOwners] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<any[]>('/users', token).then((data: any) => setOwners(data || [])).catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold mb-2" style={{ color: '#000666' }}>Owners</h1>
      <p className="text-sm mb-8" style={{ color: '#454652' }}>Manage platform store owners</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Owners', value: owners.length || '—', color: '#000666' },
          { label: 'Active Stores', value: '—', color: '#22c55e' },
          { label: 'Pending Payouts', value: '—', color: '#fd6c00' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-6 bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
            <p className="text-sm" style={{ color: '#454652' }}>{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {owners.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)]" style={{ color: '#454652' }}>
          No owners found
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: '#eeeeee', color: '#454652' }}>
                <th className="pb-4 px-4 pt-4">Name</th>
                <th className="pb-4 px-4 pt-4">Email</th>
                <th className="pb-4 px-4 pt-4">Joined</th>
                <th className="pb-4 px-4 pt-4">Stores</th>
                <th className="pb-4 px-4 pt-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((o: any) => (
                <tr key={o.id} className="border-b" style={{ borderColor: '#f3f3f3' }}>
                  <td className="py-4 px-4 font-medium" style={{ color: '#1a1c1c' }}>{o.profile?.firstName || o.name || '—'}</td>
                  <td className="py-4 px-4" style={{ color: '#454652' }}>{o.email}</td>
                  <td className="py-4 px-4" style={{ color: '#454652' }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="py-4 px-4" style={{ color: '#454652' }}>{o.locationOwners?.length || 0}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                      {o.isActive ? 'Active' : 'Inactive'}
                    </span>
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
