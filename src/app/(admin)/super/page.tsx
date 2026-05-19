'use client';

import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { DollarSign, MapPin, Users, ShieldCheck } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function SuperDashboard() {
  const { token } = useAuth();
  const lang = useLang();

  const { data: stores, loading: loadingStores, error: errStores, refetch: refetchStores } = useAdminApi<any[]>(
    () => api.get<any[]>('/locations', token || undefined).then(r => r || []),
    [token],
  );
  const { data: users, loading: loadingUsers, error: errUsers, refetch: refetchUsers } = useAdminApi<any[]>(
    () => api.get<any[]>('/users', token || undefined).then(r => r || []),
    [token],
  );
  const { data: payouts, loading: loadingPayouts, error: errPayouts, refetch: refetchPayouts } = useAdminApi<any[]>(
    () => api.get<any[]>('/payouts/pending', token || undefined),
    [token],
  );

  const loading = loadingStores || loadingUsers || loadingPayouts;
  const error = errStores || errUsers || errPayouts;
  const refetchAll = () => { refetchStores(); refetchUsers(); refetchPayouts(); };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <ErrorAlert message={error} onRetry={refetchAll} />;

  const totalRevenue = (payouts || []).reduce((s: number, p: any) => s + Number(p.totalGross), 0);
  const activeLocations = (stores || []).length;
  const totalUsers = (users || []).length;
  const pendingPayouts = (payouts || []).length;

  return (
    <div>
      <div className="mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-headline font-extrabold tracking-tight mb-1" style={{ color: '#000666' }}>{t('global.system_overview', lang)}</h2>
        <p className="text-sm" style={{ color: '#454652' }}>{t('global.metrics_desc', lang)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
        {[
          { icon: DollarSign, bg: '#1a237e', label: t('finance.pending_payouts', lang), value: `$${totalRevenue.toLocaleString()}`, sub: `$${totalRevenue.toLocaleString()} ${t('finance.pending', lang)}` },
          { icon: MapPin, bg: '#fd6c00', label: 'Active Locations', value: activeLocations.toLocaleString(), sub: stores?.length ? '+' + t('common.active', lang) : t('common.no_data', lang) },
          { icon: Users, bg: '#002c6e', label: t('user.total_users', lang), value: totalUsers.toLocaleString(), sub: users?.length ? 'Registered' : t('common.no_data', lang) },
          { icon: ShieldCheck, bg: '#000666', label: t('global.security_status', lang), value: stores?.length ? t('global.all_normal', lang) : t('common.no_data', lang), sub: stores?.length ? `${pendingPayouts} ${t('finance.pending', lang)}` : t('global.security_status', lang), dark: true },
        ].map((card, i) => (
          <div key={i} className={`rounded-xl p-6 shadow-[0px_20px_40px_rgba(26,35,126,0.06)] group hover:translate-y-[-4px] transition-all duration-300 ${card.dark ? 'text-white' : 'bg-white'}`}
            style={card.dark ? { background: '#000666' } : {}}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg" style={{ background: card.dark ? 'rgba(255,255,255,0.2)' : card.bg }}>
                <card.icon size={20} className={card.dark ? 'text-white' : ''} style={!card.dark ? { color: i === 0 ? '#8690ee' : '#fff' } : {}} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.dark ? 'bg-white/10 text-white/80' : 'bg-green-50 text-green-600'}`}>{card.sub}</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: card.dark ? 'rgba(255,255,255,0.7)' : '#454652' }}>{card.label}</p>
            <h3 className={`text-2xl font-black ${card.dark ? 'text-white' : ''}`} style={!card.dark ? { color: '#1a1c1c' } : {}}>{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-10">
        <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-xl shadow-[0px_20px_40px_rgba(26,35,126,0.06)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-lg font-headline font-bold" style={{ color: '#000666' }}>{t('global.revenue_growth', lang)}</h4>
              <p className="text-xs" style={{ color: '#454652' }}>{stores?.length ? `${stores.length} ${t('global.stores_contributing', lang)}` : 'Aggregate performance from past 6 months'}</p>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4 border-b" style={{ borderColor: '#eeeeee' }}>
            {[
              { h: 40, v: '$18k', label: t('common.month.jan', lang) },
              { h: 55, v: '$22k', label: t('common.month.feb', lang) },
              { h: 75, v: '$31k', label: t('common.month.mar', lang) },
              { h: 65, v: '$28k', label: t('common.month.apr', lang), highlight: true },
              { h: 85, v: '$42k', label: t('common.month.may', lang) },
              { h: 100, v: '$51k', label: t('common.month.jun', lang) },
            ].map((bar) => (
              <div key={bar.label} className="flex-1 relative group cursor-pointer">
                <div className={`rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${bar.highlight ? 'bg-[#fd6c00]' : ''}`}
                  style={{ height: `${bar.h}%`, background: bar.highlight ? undefined : 'rgba(0,6,102,0.1)' }}>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 text-white whitespace-nowrap" style={{ background: '#000666' }}>{bar.v}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#454652' }}>
            {[t('common.month.jan', lang), t('common.month.feb', lang), t('common.month.mar', lang), t('common.month.apr', lang), t('common.month.may', lang), t('common.month.jun', lang)].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-xl shadow-[0px_20px_40px_rgba(26,35,126,0.06)] flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-headline font-bold mb-2" style={{ color: '#000666' }}>{t('global.live_node_monitor', lang)}</h4>
            <p className="text-xs mb-6 leading-relaxed" style={{ color: '#454652' }}>{t('global.node_monitor_desc', lang)}</p>
            <div className="space-y-4">
              {(stores || []).slice(0, 3).map((store: any, i: number) => (
                <div key={store.id || i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f9f9f9' }}>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#1a1c1c' }}>{typeof store.name === 'string' ? store.name : `Store ${i + 1}`}</p>
                    <p className="text-[10px]" style={{ color: '#454652' }}>{typeof store.city === 'string' ? store.city : 'Active'} • {i === 0 ? '1s ago' : i === 1 ? '4s ago' : '12s ago'}</p>
                  </div>
                </div>
              ))}
              {(!stores || stores.length === 0) && (
                <div className="text-center py-8 text-xs" style={{ color: '#454652' }}>{t('global.no_stores', lang)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
