'use client';

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

function totalCapacity(cap: any): number {
  if (cap && typeof cap === 'object') {
    return (Number(cap.small) || 0) + (Number(cap.medium) || 0) + (Number(cap.large) || 0);
  }
  return Number(cap) || 0;
}

export default function SuperBookings() {
  const { token } = useAuth();
  const lang = useLang();

  const { data: stores, loading, error, refetch } = useAdminApi(
    () => token ? api.get<any[]>('/locations', token).then(r => r || []) : Promise.resolve([]),
    [token],
  );

  const [search, setSearch] = useState('');
  const allStores = stores || [];
  const filtered = useMemo(() => {
    if (!search.trim()) return allStores;
    const q = search.toLowerCase();
    return allStores.filter((s: any) =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.city || '').toLowerCase().includes(q) ||
      (s.address || '').toLowerCase().includes(q)
    );
  }, [allStores, search]);

  const cities = [...new Set(allStores.map((s: any) => s.city).filter(Boolean))];

  if (loading) return <LoadingSpinner text="Loading stores..." />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#454652' }}>
            <span>{t('nav.store_directory', lang)}</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span style={{ color: '#000666' }}>Storage Partners</span>
          </nav>
          <h2 className="text-4xl font-headline font-extrabold tracking-tight" style={{ color: '#000666' }}>{t('nav.store_directory', lang)}</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all" style={{ color: '#000666' }}>
            <span className="material-symbols-outlined">filter_list</span>
            {t('store.advanced_filters', lang)}
          </button>
          <Link href="/super/bookings/new" className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
            <span className="material-symbols-outlined">add</span>
            {t('store.register_new', lang)}
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl p-6 mb-8 flex flex-wrap items-center gap-6" style={{ background: '#f3f3f3' }}>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black uppercase tracking-tighter mb-1.5 ml-1" style={{ color: '#454652' }}>{t('common.search', lang)}</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`${t('common.search', lang)} by name, city...`}
            className="w-full bg-white border-none rounded-xl py-3 px-4 text-sm font-medium outline-none" style={{ color: '#1a1c1c' }} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black uppercase tracking-tighter mb-1.5 ml-1" style={{ color: '#454652' }}>{t('store.location_city', lang)}</label>
          <select className="w-full bg-white border-none rounded-xl py-3 px-4 text-sm font-medium outline-none" style={{ color: '#1a1c1c' }}>
            <option>{t('store.all_cities', lang)}</option>
            {cities.map((c: any) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[240px]">
          <label className="block text-[10px] font-black uppercase tracking-tighter mb-1.5 ml-1" style={{ color: '#454652' }}>{t('store.min_rating', lang)}</label>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-1.5">
            <span className="material-symbols-outlined" style={{ color: '#9f4200', fontVariationSettings: "'FILL' 1" }}>star</span>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#eeeeee' }}>
              <div className="w-3/4 h-full rounded-full" style={{ background: '#9f4200' }} />
            </div>
          </div>
        </div>
        <div className="flex-none flex gap-2 self-end">
          <button className="p-3 bg-white rounded-xl transition-colors" style={{ color: '#454652' }}>
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className="p-3 rounded-xl text-white transition-colors" style={{ background: '#000666' }}>
            <span className="material-symbols-outlined">list</span>
          </button>
        </div>
      </div>

      {/* Store List */}
      <div className="space-y-4">
        {(filtered.length > 0 ? filtered : [
          { name: 'Victoria Central Hub', city: 'London, UK', owner: 'Secure Holdings Ltd', capacity: { small: 50, medium: 30, large: 20 }, rating: 4.9, reviews: 124 },
          { name: 'Manhattan Safe Harbor', city: 'New York, USA', owner: 'Metropolitan Assets LLC', capacity: { small: 30, medium: 20, large: 10 }, rating: 4.7, reviews: 89 },
          { name: 'Ginza Premium Storage', city: 'Tokyo, Japan', owner: 'Shinoda Logistics Corp', capacity: { small: 80, medium: 50, large: 30 }, rating: 5.0, reviews: 205, featured: true },
          { name: 'Berlin Underground Depot', city: 'Berlin, Germany', owner: 'Klaus Storage GmbH', capacity: { small: 40, medium: 35, large: 15 }, rating: 4.5, reviews: 54 },
        ]).map((store: any, i: number) => {
          const totalSlots = totalCapacity(store.capacity);
          return (
          <Link key={store.id || i} href={`/super/bookings/${store.id}`} className={`bg-white rounded-2xl p-5 flex items-center gap-8 shadow-[0px_4px_12px_rgba(26,35,126,0.03)] hover:shadow-[0px_12px_24px_rgba(26,35,126,0.06)] transition-all group ${store.featured ? 'border-l-4' : ''}`}
            style={store.featured ? { borderLeftColor: '#fd6c00' } : {}}>
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: 'rgba(0,6,102,0.05)' }}>
              🏪
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-headline font-extrabold truncate transition-colors group-hover:opacity-80" style={{ color: '#1a1c1c' }}>{typeof store.name === 'string' ? store.name : `Store ${i + 1}`}</h3>
                {store.featured && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase" style={{ background: 'rgba(253,108,0,0.1)', color: '#9f4200' }}>{t('store.featured', lang)}</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium rounded-full px-3 py-1" style={{ background: '#eeeeee', color: '#454652' }}>{typeof store.city === 'string' ? store.city : t('common.none', lang)}</span>
                {store.rating && (
                  <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#9f4200' }}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {store.rating} ({store.reviews} {t('store.reviews', lang)})
                  </div>
                )}
              </div>
            </div>
            <div className="w-48">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#454652' }}>{t('common.owner', lang)}</p>
              <p className="text-sm font-semibold" style={{ color: '#1a1c1c' }}>{typeof store.owner === 'string' ? store.owner : '—'}</p>
            </div>
            <div className="w-40 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#454652' }}>{t('store.total_capacity', lang)}</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg font-headline font-extrabold" style={{ color: '#000666' }}>{totalSlots}</span>
                <span className="text-xs" style={{ color: '#454652' }}>{t('common.slots', lang)}</span>
              </div>
              <div className="flex justify-center gap-2 mt-1">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: '#f3f3f3', color: '#454652' }}>S:{store.capacity?.small || 0}</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: '#f3f3f3', color: '#454652' }}>M:{store.capacity?.medium || 0}</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: '#f3f3f3', color: '#454652' }}>L:{store.capacity?.large || 0}</span>
              </div>
            </div>
            <div className="flex-shrink-0 pl-4">
              <span className="font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300 inline-block" style={{ background: '#eeeeee', color: '#000666' }}>
                {t('common.view_details', lang)}
              </span>
            </div>
          </Link>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-between items-center">
        <p className="text-sm font-medium" style={{ color: '#454652' }}>{t('common.showing', lang)} 1-{Math.min(4, filtered.length || 0)} {t('common.of', lang)} {filtered.length || 0} {t('common.store', lang)}s</p>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white transition-colors" style={{ color: '#454652' }}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {[1, 2, 3].map((p) => (
            <button key={p} className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold ${p === 1 ? 'text-white shadow-md' : 'bg-white'}`}
              style={p === 1 ? { background: '#000666' } : { color: '#454652' }}>
              {p}
            </button>
          ))}
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white transition-colors" style={{ color: '#454652' }}>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
