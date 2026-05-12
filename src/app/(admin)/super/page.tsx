'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function SuperDashboard() {
  const { token, logout } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<any[]>('/locations', token).then((d) => setStores(d || [])).catch(() => {});
  }, [token]);

  const totalRevenue = 124500;
  const activeLocations = stores.length || 482;
  const totalUsers = 12500;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-headline font-extrabold tracking-tight mb-1" style={{ color: '#000666' }}>Global System Overview</h2>
        <p className="text-sm" style={{ color: '#454652' }}>Real-time performance metrics across all transit nodes.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Revenue', value: `$${(totalRevenue).toLocaleString()}`, change: '+12%', changeColor: 'text-green-600', bg: 'bg-green-50', icon: 'payments', iconBg: '#1a237e', iconColor: '#8690ee' },
          { label: 'Active Locations', value: activeLocations.toLocaleString(), change: '+8%', changeColor: 'text-green-600', bg: 'bg-green-50', icon: 'location_on', iconBg: '#fd6c00', iconColor: 'white' },
          { label: 'Total Users', value: totalUsers.toLocaleString(), change: 'Steady', changeColor: 'text-gray-500', bg: 'bg-gray-100', icon: 'group', iconBg: '#002c6e', iconColor: '#6b95f3' },
          { label: 'Security Status', value: 'All systems normal', change: 'Secure', changeColor: 'text-white/80', bg: 'bg-white/10', icon: 'verified_user', iconBg: 'transparent', iconColor: 'white', dark: true },
        ].map((kpi) => (
          <div key={kpi.label} className={`rounded-xl p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.06)] group hover:translate-y-[-4px] transition-all duration-300 ${kpi.dark ? 'text-white' : 'bg-white'}`}
            style={kpi.dark ? { background: '#000666' } : {}}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg" style={{ background: kpi.dark ? 'rgba(255,255,255,0.2)' : kpi.iconBg }}>
                <span className="material-symbols-outlined" style={{ color: kpi.iconColor }}>{kpi.icon}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.bg} ${kpi.changeColor}`}>{kpi.change}</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: kpi.dark ? 'rgba(255,255,255,0.7)' : '#454652' }}>{kpi.label}</p>
            <h3 className={`text-2xl font-black ${kpi.dark ? 'text-white' : ''}`} style={kpi.dark ? {} : { color: '#1a1c1c' }}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Chart + Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-[0px_20px_40px_rgba(26,35,126,0.06)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-lg font-headline font-bold" style={{ color: '#000666' }}>Global Revenue Growth</h4>
              <p className="text-xs" style={{ color: '#454652' }}>Aggregate performance from past 6 months</p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#eeeeee', color: '#454652' }}>Export CSV</button>
              <button className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: '#000666' }}>Monthly View</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4 border-b" style={{ borderColor: '#eeeeee' }}>
            {[
              { h: 40, v: '$18k', label: 'Jan' },
              { h: 55, v: '$22k', label: 'Feb' },
              { h: 75, v: '$31k', label: 'Mar' },
              { h: 65, v: '$28k', label: 'Apr', highlight: true },
              { h: 85, v: '$42k', label: 'May' },
              { h: 100, v: '$51k', label: 'Jun' },
            ].map((bar) => (
              <div key={bar.label} className="flex-1 relative group cursor-pointer">
                <div
                  className={`rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${bar.highlight ? 'bg-[#fd6c00]' : ''}`}
                  style={{ height: `${bar.h}%`, background: bar.highlight ? undefined : 'rgba(0,6,102,0.1)' }}>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 text-white whitespace-nowrap" style={{ background: '#000666' }}>{bar.v}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#454652' }}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>

        {/* Live Node Monitor */}
        <div className="bg-white p-8 rounded-xl shadow-[0px_20px_40px_rgba(26,35,126,0.06)] flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-headline font-bold mb-2" style={{ color: '#000666' }}>Live Node Monitor</h4>
            <p className="text-xs mb-6 leading-relaxed" style={{ color: '#454652' }}>Centralized encryption heartbeat for all active storage facilities.</p>
            <div className="space-y-4">
              {[
                { icon: 'check_circle', color: '#22c55e', title: 'London Hub LHR-2', sub: 'Sync Complete • 1s ago' },
                { icon: 'check_circle', color: '#22c55e', title: 'Tokyo Terminal TYO-1', sub: 'Sync Complete • 4s ago' },
                { icon: 'sync', color: '#fd6c00', title: 'New York Grand NY-4', sub: 'Encrypted Handshake...', pulse: true },
              ].map((node) => (
                <div key={node.title} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f9f9f9' }}>
                  <span className={`material-symbols-outlined ${node.pulse ? 'animate-pulse' : ''}`} style={{ color: node.color }}>{node.icon}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#1a1c1c' }}>{node.title}</p>
                    <p className="text-[10px]" style={{ color: '#454652' }}>{node.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full py-3 text-white font-bold rounded-xl text-xs mt-6 hover:opacity-90 transition-all" style={{ background: '#000666' }}>
            Generate Security Report
          </button>
        </div>
      </div>

      {/* Store Performance Table */}
      <div className="bg-white rounded-xl shadow-[0px_20px_40px_rgba(26,35,126,0.06)] overflow-hidden">
        <div className="p-8 border-b" style={{ borderColor: '#eeeeee' }}>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xl font-headline font-extrabold" style={{ color: '#000666' }}>Store Performance Directory</h4>
              <p className="text-xs" style={{ color: '#454652' }}>Detailed utilization metrics by individual transit hub</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="rounded-lg py-2 px-3 text-xs font-bold outline-none" style={{ background: '#f3f3f3', color: '#1a1c1c' }}>
                <option>Filter by Region</option>
                <option>Europe</option>
                <option>North America</option>
                <option>Asia Pacific</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ background: 'rgba(243,243,243,0.5)', color: '#454652' }}>
                <th className="px-8 py-4">Store Name</th>
                <th className="px-8 py-4">Location</th>
                <th className="px-8 py-4">Current Occupancy</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#eeeeee' }}>
              {[
                { name: 'Victoria Central Hub', id: 'ST-LON-442', loc: 'London, UK', occ: 82, status: 'Active', statusColor: 'bg-green-100 text-green-700' },
                { name: 'Shibuya Terminal', id: 'ST-TYO-109', loc: 'Tokyo, JP', occ: 45, status: 'Active', statusColor: 'bg-green-100 text-green-700' },
                { name: 'Penn Station Annex', id: 'ST-NYC-220', loc: 'New York, USA', occ: 94, status: 'Maintenance', statusColor: 'bg-amber-100 text-amber-700', occColor: '#fd6c00' },
              ].map((store) => (
                <tr key={store.id} className="hover:opacity-80 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold" style={{ color: '#000666' }}>{store.name}</p>
                    <p className="text-[10px]" style={{ color: '#454652' }}>ID: {store.id}</p>
                  </td>
                  <td className="px-8 py-6"><span className="text-sm" style={{ color: '#1a1c1c' }}>{store.loc}</span></td>
                  <td className="px-8 py-6 min-w-[200px]">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#eeeeee' }}>
                        <div className="h-full rounded-full" style={{ width: `${store.occ}%`, background: store.occColor || '#000666' }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: '#1a1c1c' }}>{store.occ}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${store.statusColor}`}>{store.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="hover:opacity-70"><span className="material-symbols-outlined" style={{ color: '#454652' }}>more_vert</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 border-t flex justify-between items-center" style={{ borderColor: '#eeeeee', background: 'rgba(243,243,243,0.2)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#454652' }}>Showing 3 of {activeLocations} stores</p>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-white transition-colors disabled:opacity-50" disabled style={{ borderColor: 'rgba(198,197,212,0.3)' }}>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="p-2 border rounded-lg hover:bg-white transition-colors" style={{ borderColor: 'rgba(198,197,212,0.3)' }}>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
