'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function SuperOwners() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<any[]>('/users', token).then((data: any) => setUsers(data || [])).catch(() => {});
  }, [token]);

  const totalUsers = users.length;
  const pendingCount = users.filter((u: any) => !u.isEmailVerified).length;

  return (
    <div>
      {/* Header & Action Row */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#1a1c1c' }}>User Management</h2>
          <p className="font-medium" style={{ color: '#454652' }}>Oversee system access, roles, and verification statuses.</p>
        </div>
        <button className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-[0px_10px_20px_rgba(26,35,126,0.15)]"
          style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
          <span className="material-symbols-outlined text-sm">person_add</span>
          Invite New User
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b mb-8" style={{ borderColor: 'rgba(198,197,212,0.2)' }}>
        {['Customers', 'Partners', 'Staff'].map((tab, i) => (
          <button key={tab} className={`pb-4 px-2 font-medium transition-colors ${i === 0 ? 'font-bold border-b-2' : ''}`}
            style={i === 0 ? { color: '#000666', borderColor: '#000666' } : { color: '#454652' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)] mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ background: 'rgba(238,238,238,0.5)', color: '#767683' }}>
                <th className="px-8 py-5">User Details</th>
                <th className="px-6 py-5">Role / Permissions</th>
                <th className="px-6 py-5">Joined Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(198,197,212,0.1)' }}>
              {users.slice(0, 10).map((u: any) => {
                const isVerified = u.isEmailVerified;
                const roleName = u.roles?.[0]?.role?.name || u.roles?.[0] || 'client';
                const roleConfig: Record<string, { icon: string; label: string; bg: string; color: string }> = {
                  admin: { icon: 'admin_panel_settings', label: 'Admin', bg: 'rgba(0,44,110,0.1)', color: '#001944' },
                  owner: { icon: 'handshake', label: 'Partner Admin', bg: 'rgba(253,108,0,0.1)', color: '#9f4200' },
                  client: { icon: 'shopping_bag', label: 'Customer', bg: 'rgba(26,35,126,0.1)', color: '#1a237e' },
                  staff: { icon: 'admin_panel_settings', label: 'Staff', bg: 'rgba(0,44,110,0.1)', color: '#001944' },
                };
                const role = roleConfig[roleName] || roleConfig.client;

                return (
                  <tr key={u.id} className="hover:opacity-80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                          {(u.profile?.firstName?.[0] || u.name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: '#1a1c1c' }}>{u.profile?.firstName || u.name || 'User'}</p>
                          <p className="text-xs" style={{ color: '#454652' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: role.bg, color: role.color }}>
                        <span className="material-symbols-outlined text-[14px]">{role.icon}</span>
                        {role.label}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-medium" style={{ color: '#454652' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-6">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${isVerified ? 'text-green-700' : ''}`} style={!isVerified ? { color: '#9f4200' } : {}}>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {isVerified ? 'verified' : 'pending'}
                        </span>
                        {isVerified ? 'Verified' : 'Pending'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all" style={{ color: '#000666' }}>
                          <span className="material-symbols-outlined text-xl">key</span>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all" style={{ color: '#000666' }}>
                          <span className="material-symbols-outlined text-xl">lock_reset</span>
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-all" style={{ color: '#dc2626' }}>
                          <span className="material-symbols-outlined text-xl">block</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 flex items-center justify-between border-t" style={{ background: 'rgba(238,238,238,0.3)', borderColor: 'rgba(198,197,212,0.1)' }}>
          <p className="text-sm font-medium" style={{ color: '#454652' }}>Showing 1-{Math.min(10, totalUsers)} of {totalUsers} users</p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border transition-colors" style={{ borderColor: 'rgba(198,197,212,0.3)', color: '#767683' }}>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white font-bold shadow-lg" style={{ background: '#000666' }}>1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 font-medium transition-colors" style={{ color: '#1a1c1c' }}>2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 font-medium transition-colors" style={{ color: '#1a1c1c' }}>3</button>
            <span className="px-2" style={{ color: '#767683' }}>...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border transition-colors" style={{ borderColor: 'rgba(198,197,212,0.3)', color: '#767683' }}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] text-white flex items-center justify-between" style={{ background: '#000666' }}>
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Total Users</p>
            <h4 className="text-3xl font-black font-headline">{totalUsers.toLocaleString()}</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>
        <div className="p-6 rounded-[2rem] border-2 flex items-center justify-between bg-white" style={{ borderColor: 'rgba(0,6,102,0.05)' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>Awaiting Review</p>
            <h4 className="text-3xl font-black font-headline" style={{ color: '#9f4200' }}>{pendingCount}</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(253,108,0,0.1)', color: '#9f4200' }}>
            <span className="material-symbols-outlined text-2xl">how_to_reg</span>
          </div>
        </div>
        <div className="p-6 rounded-[2rem] border-2 flex items-center justify-between bg-white" style={{ borderColor: 'rgba(0,6,102,0.05)' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>Growth (MTD)</p>
            <h4 className="text-3xl font-black font-headline" style={{ color: '#22c55e' }}>+12.5%</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
            <span className="material-symbols-outlined text-2xl">trending_up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
