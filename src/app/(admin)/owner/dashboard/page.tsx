'use client';

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { t, useLang } from "@/lib/i18n";
import { api } from "@/lib/api";
import { Store, ChevronDown } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function OwnerDashboard() {
  const { token } = useAuth();
  const lang = useLang();
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: stats, loading: loadingStats, error: errStats } = useAdminApi<any>(
    () => api.get('/locations/owner/stats', token || undefined),
    [token],
  );
  const { data: storesData, loading: loadingStores, error: errStores } = useAdminApi(
    () => api.get<any[]>('/locations/me', token || undefined).then(d => { if (d?.length > 0 && !selectedStore) setSelectedStore(d[0].id); return d || []; }),
    [token],
  );
  const { data: bookings, loading: loadingBk, error: errBk, refetch: refetchBk } = useAdminApi(
    () => {
      const params = new URLSearchParams();
      if (selectedStore) params.set('locationId', selectedStore);
      return api.get<any[]>(`/bookings/me?${params}`, token || undefined).then(d => d || []);
    },
    [token, selectedStore],
  );

  const stores = storesData || [];
  const loading = loadingStats || loadingStores || loadingBk;
  const error = errStats || errStores || errBk;

  const currentStore = stores.find((s: any) => s.id === selectedStore);
  const activeBookings = stats?.bookings?.activeCount ?? bookings?.filter((b: any) => ['in_storage', 'confirmed'].includes(b.status)).length ?? 0;
  const incomingToday = stats?.dropoffs?.totalToday ?? 0;
  const occupancyPct = stats?.occupancy?.[0]?.percentage ?? 0;
  const recentBookings = useMemo(() => (bookings || []).filter((b: any) => ['in_storage', 'confirmed'].includes(b.status)).slice(0, 5), [bookings]);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <ErrorAlert message={error} onRetry={refetchBk} />;

  return (
    <div>
      <div className="flex justify-between items-start mb-6 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#000666' }}>{t('owner.performance_hub', lang)}</h2>
          <p className="font-medium" style={{ color: '#454652' }}>
            {stores.length > 0 ? stores.length === 1 ? currentStore?.city || '' : `${t('owner.managing_stores', lang)} ${stores.length}` : ''}
          </p>
        </div>

        {stores.length > 0 && (
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white pl-3 pr-2 py-1.5 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-[#000666]/10"
              style={{ color: '#000666' }}>
              <Store size={16} />
              <span className="text-sm font-bold max-w-[140px] truncate">{currentStore?.name || t('common.all', lang)}</span>
              <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: '#767683' }} />
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border z-20 py-1.5" style={{ borderColor: 'rgba(198,197,212,0.2)' }}>
                  {stores.map((s: any) => (
                    <button key={s.id} onClick={() => { setSelectedStore(s.id); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-70 ${selectedStore === s.id ? 'font-bold' : ''}`}
                      style={{ color: selectedStore === s.id ? '#000666' : '#454652' }}>
                      <span className="block truncate">{s.name}</span>
                      <span className="text-[10px] block truncate" style={{ color: '#767683' }}>{s.city}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
        <div className="bg-white rounded-[24px] p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined p-2 rounded-xl" style={{ background: 'rgba(0,6,102,0.05)', color: '#000666' }}>check_circle</span>
            <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: '#ecfdf5', color: '#059669' }}>+12%</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#454652' }}>{t('owner.active_bookings', lang)}</p>
            <h3 className="text-2xl sm:text-3xl font-headline font-extrabold" style={{ color: '#000666' }}>{activeBookings}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined p-2 rounded-xl" style={{ background: 'rgba(253,108,0,0.05)', color: '#fd6c00' }}>schedule</span>
            <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: '#fffbeb', color: '#d97706' }}>{t('owner.incoming_today', lang)}</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#454652' }}>{t('owner.incoming_today', lang)}</p>
            <h3 className="text-2xl sm:text-3xl font-headline font-extrabold" style={{ color: '#000666' }}>{incomingToday}</h3>
          </div>
        </div>

        <div className="md:col-span-2 rounded-[24px] p-6 text-white flex items-center justify-between overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
          <div className="z-10">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{t('owner.live_occupancy', lang)}</p>
            <h3 className="text-5xl font-headline font-extrabold mb-2">{occupancyPct}%</h3>
            <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${occupancyPct}%`, background: '#fd6c00' }} />
            </div>
          </div>
          <div className="z-10 text-right">
            <p className="text-white/60 text-xs font-medium mb-1">{t('common.available', lang)}</p>
            <p className="text-2xl font-bold">16 / 100</p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-4 sm:p-8 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-10">
          <div>
            <h4 className="text-2xl font-headline font-extrabold tracking-tight" style={{ color: '#000666' }}>{t('owner.revenue_performance', lang)}</h4>
            <p className="text-sm font-medium" style={{ color: '#454652' }}>{selectedStore && currentStore ? currentStore.name : t('owner.revenue_performance_desc', lang)}</p>
          </div>
          <div className="flex p-1 rounded-xl" style={{ background: '#eeeeee' }}>
            <button className="px-4 py-2 bg-white shadow-sm rounded-lg text-sm font-bold" style={{ color: '#000666' }}>{t('common.today', lang)}</button>
            <button className="px-4 py-2 text-sm font-bold" style={{ color: '#454652' }}>{t('common.this_week', lang)}</button>
            <button className="px-4 py-2 text-sm font-bold" style={{ color: '#454652' }}>{t('common.this_month', lang)}</button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-headline font-bold" style={{ color: '#000666' }}>{t('owner.active_bookings', lang)}</h4>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: '#f3f3f3', color: '#454652' }}>{recentBookings.length} {t('common.active', lang)}</span>
          </div>
          {recentBookings.length === 0 ? (
            <div className="py-12 text-center text-sm" style={{ color: '#454652' }}>{t('owner.no_active_bookings', lang)}</div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: '#eeeeee', color: '#454652' }}>
                  <th className="pb-4 px-2">{t('common.store', lang)}</th>
                  <th className="pb-4 px-2">{t('common.customer', lang)}</th>
                  <th className="pb-4 px-2">Items</th>
                  <th className="pb-4 px-2">{t('common.status', lang)}</th>
                  <th className="pb-4 px-2 text-right">{t('common.total', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b: any) => (
                  <tr key={b.id} className="border-b transition-colors hover:opacity-80" style={{ borderColor: '#f3f3f3' }}>
                    <td className="py-4 px-2">
                      <span className="text-xs font-medium" style={{ color: '#000666' }}>{b.location?.name || '—'}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                          {(b.user?.profile?.firstName?.[0] || b.user?.name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: '#000666' }}>{b.user?.profile?.firstName || b.user?.name || 'Guest'}</p>
                          <p className="text-[10px]" style={{ color: '#454652' }}>{b.id?.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm" style={{ color: '#454652' }}>
                      {b.items ? `${b.items.small || 0}S ${b.items.medium || 0}M ${b.items.large || 0}L` : '—'}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                        b.status === 'in_storage' ? 'bg-blue-50 text-blue-700' : ''
                      }`}>{b.status}</span>
                    </td>
                    <td className="py-4 px-2 text-right font-bold" style={{ color: '#000666' }}>${Number(b.totalPrice).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
          <h4 className="text-xl font-headline font-bold mb-6" style={{ color: '#000666' }}>{t('owner.my_stores', lang)}</h4>
          {stores.length === 0 ? (
            <div className="py-12 text-center text-sm" style={{ color: '#454652' }}>{t('store.no_stores', lang)}</div>
          ) : (
          <div className="space-y-4">
            {stores.map((s: any) => {
              const cap = s.capacity ? (Number(s.capacity.small || 0) + Number(s.capacity.medium || 0) + Number(s.capacity.large || 0)) : 0;
              const isSelected = s.id === selectedStore;
              return (
                <button key={s.id} onClick={() => setSelectedStore(s.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${isSelected ? 'shadow-sm' : 'hover:opacity-80'}`}
                  style={{ background: isSelected ? '#e0e0ff' : '#f3f3f3' }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#000666' }}>{s.name}</p>
                      <p className="text-[10px]" style={{ color: '#454652' }}>{s.city}</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#000666' }}>{cap} {t('common.slots', lang)}</span>
                  </div>
                  {s.pricePerDay?.small && (
                    <p className="text-[10px]" style={{ color: '#454652' }}>{t('store.from_small', lang)} {s.currency || 'USD'} {s.pricePerDay.small}/day</p>
                  )}
                </button>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
