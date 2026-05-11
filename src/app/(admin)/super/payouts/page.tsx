'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
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
      <h1 className="text-2xl font-bold text-blue-900 mb-1">Payouts</h1>
      <p className="text-sm text-gray-500 mb-8">Manage owner payouts</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <Card><CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Clock size={20} className="text-blue-900" /></div></div>
          <p className="text-2xl font-bold">{payouts.length}</p>
          <p className="text-sm text-gray-500">Pending payouts</p>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><DollarSign size={20} className="text-green-600" /></div></div>
          <p className="text-2xl font-bold">${total.toFixed(0)}</p>
          <p className="text-sm text-gray-500">Total to pay</p>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><CheckCircle size={20} className="text-indigo-600" /></div></div>
          <p className="text-2xl font-bold">{payouts.filter(p => p.status === 'paid').length}</p>
          <p className="text-sm text-gray-500">Paid</p>
        </CardContent></Card>
      </div>

      {payouts.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-gray-400">No pending payouts</CardContent></Card>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-gray-500 text-left">
              <th className="p-4 font-medium">Owner</th>
              <th className="p-4 font-medium">Period</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-b border-gray-50">
                  <td className="p-4 font-medium text-gray-900">{p.ownerId?.slice(0, 8)}</td>
                  <td className="p-4 text-gray-600">{p.periodStart?.split('T')[0]} — {p.periodEnd?.split('T')[0]}</td>
                  <td className="p-4 font-medium">${Number(p.totalGross).toFixed(0)}</td>
                  <td className="p-4"><span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Pending</span></td>
                  <td className="p-4">
                    <button className="text-xs font-medium text-blue-900 hover:text-blue-700">Mark as Paid</button>
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
