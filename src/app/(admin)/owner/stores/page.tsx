'use client';

import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { MapPin, Package, DollarSign, Store } from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function OwnerStores() {
  const { token } = useAuth();
  const lang = useLang();

  const { data: stores, loading, error, refetch } = useAdminApi(
    () => token ? api.get<any[]>('/locations/me', token).then(r => r || []) : Promise.resolve([]),
    [token],
  );

  if (loading) return <LoadingSpinner text="Loading stores..." />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;
  const storeList = stores || [];

  return (
    <div>
      <div className="mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#000666' }}>{t('owner.my_stores', lang)}</h2>
        <p className="font-medium" style={{ color: '#454652' }}>{t('owner.your_stores', lang)}</p>
      </div>

      {storeList.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)]" style={{ color: '#454652' }}>
          <Store size={40} className="mx-auto mb-4 opacity-40" />
          {t('store.no_stores', lang)}. {t('store.no_stores_desc', lang)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeList.map((s: any) => {
            const totalCap = (Number(s.capacity?.small || 0) + Number(s.capacity?.medium || 0) + Number(s.capacity?.large || 0));
            return (
              <Link key={s.id} href={`/owner/stores/${s.id}`} className="bg-white rounded-2xl p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] hover:shadow-lg hover:-translate-y-0.5 transition-all block cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'rgba(0,6,102,0.05)' }}>
                    🏪
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold truncate" style={{ color: '#000666' }}>{s.name}</h3>
                    <p className="text-xs flex items-center gap-1" style={{ color: '#454652' }}>
                      <MapPin size={12} /> {s.city}, {s.country}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-xl" style={{ background: '#f3f3f3' }}>
                    <Package size={16} className="mx-auto mb-1" style={{ color: '#000666' }} />
                    <p className="text-xs font-bold" style={{ color: '#000666' }}>{totalCap}</p>
                    <p className="text-[10px]" style={{ color: '#454652' }}>{t('common.slots', lang)}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: '#f3f3f3' }}>
                    <DollarSign size={16} className="mx-auto mb-1" style={{ color: '#9f4200' }} />
                    <p className="text-xs font-bold" style={{ color: '#9f4200' }}>{s.currency || 'USD'} {s.pricePerDay?.small || 0}</p>
                    <p className="text-[10px]" style={{ color: '#454652' }}>{t('store.from_small', lang)}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: '#f3f3f3' }}>
                    <span className="material-symbols-outlined text-[16px] block mb-1" style={{ color: s.isActive ? '#22c55e' : '#dc2626' }}>{s.isActive ? 'check_circle' : 'cancel'}</span>
                    <p className="text-xs font-bold" style={{ color: s.isActive ? '#22c55e' : '#dc2626' }}>{s.isActive ? t('common.active', lang) : t('common.inactive', lang)}</p>
                    <p className="text-[10px]" style={{ color: '#454652' }}>{t('common.status', lang)}</p>
                  </div>
                </div>
                <p className="text-xs" style={{ color: '#454652' }}>{s.address}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
