'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function OwnerDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    api.get('/locations/owner/stats', token).then(setStats).catch(console.error);
  }, [token]);

  const activeBookings = stats?.bookings?.activeCount ?? 0;
  const incomingToday = stats?.dropoffs?.totalToday ?? 0;
  const occupancyPct = stats?.occupancy?.[0]?.percentage ?? 0;
  const occupancyData = stats?.occupancy || [];

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0px_10px_30px_rgba(26,35,126,0.04)]">
        <div className="flex justify-between items-center w-full px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#000666] to-[#1a237e] text-white text-xs font-bold">
              SC
            </div>
            <h1 className="font-headline font-extrabold text-xl tracking-tight" style={{ color: '#1a237e' }}>Secure Custodian</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 mr-8">
              <button className="font-bold px-2 py-1 transition-colors" style={{ color: '#1a237e' }}>Overview</button>
              <button className="px-2 py-1 transition-colors" style={{ color: '#64748b' }}>Stores</button>
              <button className="px-2 py-1 transition-colors" style={{ color: '#64748b' }}>Analytics</button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold hover:bg-slate-100 transition-colors active:scale-95" style={{ background: '#eeeeee', color: '#000666' }}>
              <span className="material-symbols-outlined text-[20px]">store</span>
              <span className="text-sm">Switch Store</span>
            </button>
            <div className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#fd6c00' }} />
            </div>
          </div>
        </div>
        <div className="h-px w-full" style={{ background: '#f1f5f9' }} />
      </header>

      <div className="flex pt-16 flex-1 min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white z-40 px-4 py-8">
          <nav className="space-y-2">
            {[
              { icon: 'dashboard', label: 'Overview', active: true },
              { icon: 'inventory_2', label: 'My Stores' },
              { icon: 'calendar_today', label: 'Bookings' },
              { icon: 'payments', label: 'Finances' },
              { icon: 'settings', label: 'Settings' },
            ].map((item) => (
              <a key={item.label} href="#" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${item.active ? 'font-bold' : 'font-semibold'}`}
                style={item.active ? { background: '#eef2ff', color: '#1a237e' } : { color: '#64748b' }}>
                <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <span className="tracking-tight">{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="mt-auto p-4 rounded-2xl text-white" style={{ background: '#1a237e' }}>
            <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-2">Support Tier</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined" style={{ color: '#fd6c00' }}>verified_user</span>
              <span className="font-headline font-bold">Priority Plus</span>
            </div>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-xs font-bold">Contact Manager</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 md:p-10 mt-16">
          <div className="mb-10">
            <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#000666' }}>Performance Hub</h2>
            <p className="font-medium" style={{ color: '#454652' }}>Monitoring Central Station A (Terminal 2) • Real-time stats</p>
          </div>

          {/* Bento Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-1 bg-white rounded-[24px] p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined p-2 rounded-xl" style={{ background: 'rgba(0,6,102,0.05)', color: '#000666' }}>check_circle</span>
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: '#ecfdf5', color: '#059669' }}>+12%</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#454652' }}>Active Bookings</p>
                <h3 className="text-3xl font-headline font-extrabold" style={{ color: '#000666' }}>{activeBookings}</h3>
              </div>
            </div>

            <div className="md:col-span-1 bg-white rounded-[24px] p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined p-2 rounded-xl" style={{ background: 'rgba(253,108,0,0.05)', color: '#fd6c00' }}>schedule</span>
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: '#fffbeb', color: '#d97706' }}>High Flow</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#454652' }}>Incoming Today</p>
                <h3 className="text-3xl font-headline font-extrabold" style={{ color: '#000666' }}>{incomingToday}</h3>
              </div>
            </div>

            <div className="md:col-span-2 rounded-[24px] p-6 text-white flex items-center justify-between overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
              <div className="z-10">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Live Occupancy</p>
                <h3 className="text-5xl font-headline font-extrabold mb-2">{occupancyPct}%</h3>
                <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${occupancyPct}%`, background: '#fd6c00' }} />
                </div>
              </div>
              <div className="z-10 text-right">
                <p className="text-white/60 text-xs font-medium mb-1">Available Units</p>
                <p className="text-2xl font-bold">16 / 100</p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Revenue Performance */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h4 className="text-2xl font-headline font-extrabold tracking-tight" style={{ color: '#000666' }}>Revenue Performance</h4>
                <p className="text-sm font-medium" style={{ color: '#454652' }}>Monthly growth comparison (Last 30 Days)</p>
              </div>
              <div className="flex p-1 rounded-xl" style={{ background: '#eeeeee' }}>
                <button className="px-4 py-2 bg-white shadow-sm rounded-lg text-sm font-bold" style={{ color: '#000666' }}>Daily</button>
                <button className="px-4 py-2 text-sm font-bold" style={{ color: '#454652' }}>Weekly</button>
                <button className="px-4 py-2 text-sm font-bold" style={{ color: '#454652' }}>Monthly</button>
              </div>
            </div>
            <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4">
              {[40, 55, 45, 70, 85, 60, 75, 50].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-xl cursor-pointer relative group transition-all" style={{ background: i === 4 ? '#fd6c00' : 'rgba(0,6,102,0.1)', height: `${h}%` }}>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100" style={{ color: '#000666' }}>${(h * 60).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Bookings + Capacity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[32px] p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-headline font-bold" style={{ color: '#000666' }}>Current Bookings</h4>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg transition-colors" style={{ background: '#eeeeee', color: '#454652' }}>
                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  </button>
                  <button className="p-2 rounded-lg transition-colors" style={{ background: '#eeeeee', color: '#454652' }}>
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: '#eeeeee', color: '#454652' }}>
                      <th className="pb-4 px-2">Customer</th>
                      <th className="pb-4 px-2">Luggage</th>
                      <th className="pb-4 px-2">Duration</th>
                      <th className="pb-4 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Marcus H.', id: '#BK-9912', items: ['luggage', 'backpack'], duration: '4 Hours Left', action: 'Check-out', urgent: false },
                      { name: 'Sarah J.', id: '#BK-9914', items: ['luggage'], duration: '2 Days Left', action: 'Details', urgent: false },
                      { name: 'Chen L.', id: '#BK-9915', items: ['work', 'work'], duration: '1 Hour Left', action: 'Expiring', urgent: true },
                    ].map((row) => (
                      <tr key={row.id} className="border-b transition-colors hover:opacity-80" style={{ borderColor: '#f3f3f3' }}>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full" style={{ background: '#e2e8f0' }} />
                            <div>
                              <p className="font-bold" style={{ color: '#000666' }}>{row.name}</p>
                              <p className="text-[10px]" style={{ color: '#454652' }}>{row.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex gap-1">
                            {row.items.map((icon, i) => (
                              <span key={i} className="material-symbols-outlined text-[18px]" style={{ color: '#94a3b8' }}>{icon}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <p className="font-medium" style={{ color: '#1a1c1c' }}>{row.duration}</p>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button className="font-bold hover:underline" style={{ color: row.urgent ? '#fd6c00' : '#000666' }}>{row.action}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Capacity */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
              <h4 className="text-xl font-headline font-bold mb-6" style={{ color: '#000666' }}>Storage Logic</h4>
              <div className="space-y-6">
                {[
                  { icon: 'backpack', label: 'Small Units', current: 45, total: 50, color: '#000666' },
                  { icon: 'luggage', label: 'Medium Units', current: 32, total: 40, color: '#000666' },
                  { icon: 'conveyor_belt', label: 'Oversized', current: 8, total: 10, color: '#fd6c00' },
                ].map((item) => {
                  const pct = Math.round((item.current / item.total) * 100);
                  return (
                    <div key={item.label} className="p-4 rounded-2xl border border-transparent hover:opacity-80 transition-all" style={{ background: '#f3f3f3' }}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined" style={{ color: item.color }}>{item.icon}</span>
                          <span className="font-bold text-sm" style={{ color: '#000666' }}>{item.label}</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: '#000666' }}>{item.current} / {item.total}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: '#e2e8f0' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 p-4 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span className="text-sm font-bold">Add Capacity Layer</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full rounded-t-[24px] z-50 bg-white/90 backdrop-blur-2xl shadow-[0px_-10px_40px_rgba(26,35,126,0.08)]">
        <div className="flex justify-around items-center w-full h-20 px-4 pb-2">
          {[
            { icon: 'dashboard', label: 'Overview', active: true },
            { icon: 'calendar_today', label: 'Bookings' },
            { icon: 'inventory_2', label: 'Inventory' },
            { icon: 'settings', label: 'Settings' },
          ].map((tab) => (
            <div key={tab.label} className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl ${tab.active ? 'scale-110' : ''}`}
              style={tab.active ? { background: '#eef2ff', color: '#1a237e' } : { color: '#94a3b8' }}>
              <span className="material-symbols-outlined" style={tab.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{tab.icon}</span>
              <span className="text-[11px] font-semibold tracking-wide uppercase mt-1">{tab.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50" style={{ background: '#fd6c00' }}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </button>
    </>
  );
}
