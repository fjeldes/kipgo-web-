'use client';

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { t, useLang } from "@/lib/i18n";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

type Tab = 'customers' | 'partners' | 'staff';

const TABS: { key: Tab; label: string }[] = [
  { key: 'customers', label: 'Customers' },
  { key: 'partners', label: 'Partners' },
  { key: 'staff', label: 'Staff' },
];

const TAB_LABEL: Record<Tab, string> = {
  customers: 'user.customers',
  partners: 'user.partners',
  staff: 'user.staff_users',
};

const PAGE_SIZE = 10;

const ROLE_CONFIG: Record<string, { icon: string; label: string; bg: string; color: string }> = {
  admin: { icon: 'admin_panel_settings', label: 'Admin', bg: 'rgba(0,44,110,0.1)', color: '#001944' },
  owner: { icon: 'handshake', label: 'Partner Admin', bg: 'rgba(253,108,0,0.1)', color: '#9f4200' },
  client: { icon: 'shopping_bag', label: 'Customer', bg: 'rgba(26,35,126,0.1)', color: '#1a237e' },
  staff: { icon: 'badge', label: 'Staff', bg: 'rgba(0,44,110,0.1)', color: '#001944' },
};

export default function SuperOwners() {
  const { token } = useAuth();
  const lang = useLang();
  const [activeTab, setActiveTab] = useState<Tab>('customers');
  const [currentPage, setCurrentPage] = useState(1);
  const { data: users, loading, error, refetch } = useAdminApi<any[]>(
    () => api.get<any[]>('/users', token || undefined).then((d: any) => d || []),
    [token],
  );

  if (loading) return <LoadingSpinner text="Loading users..." />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  const filtered = useMemo(() => {
    return (users || []).filter((u: any) => {
      const roles = (u.roles || []).map((r: any) => r?.role?.name || r);
      switch (activeTab) {
        case 'customers': return roles.includes('client') && !roles.includes('staff');
        case 'partners': return roles.includes('owner');
        case 'staff': return roles.includes('staff');
        default: return true;
      }
    });
  }, [users, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const roleNames = (u: any) => (u.roles || []).map((r: any) => r?.role?.name || r).filter(Boolean);
  const displayRoles = (u: any) => { const r = roleNames(u); return r.length > 0 ? r : ['client']; };

  const counts = useMemo(() => {
    const u = users || [];
    return {
      total: u.length,
      customers: u.filter((u: any) => { const r = roleNames(u); return r.includes('client') && !r.includes('staff'); }).length,
      partners: u.filter((u: any) => roleNames(u).includes('owner')).length,
      staff: u.filter((u: any) => roleNames(u).includes('staff')).length,
      pending: u.filter((u: any) => !u.isEmailVerified).length,
    };
  }, [users]);

  useEffect(() => { setCurrentPage(1); }, [activeTab]);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#1a1c1c' }}>{t('user.user_management', lang)}</h2>
          <p className="font-medium" style={{ color: '#454652' }}>{t('user.user_management_desc', lang)}</p>
        </div>
        <button className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-[0px_10px_20px_rgba(26,35,126,0.15)]"
          style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
          <span className="material-symbols-outlined text-sm">person_add</span>
          {t('user.invite_new', lang)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b mb-8" style={{ borderColor: 'rgba(198,197,212,0.2)' }}>
        {TABS.map(({ key, label }) => {
          const active = activeTab === key;
          return (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`pb-4 px-2 font-medium transition-colors ${active ? 'font-bold border-b-2' : ''}`}
              style={active ? { color: '#000666', borderColor: '#000666' } : { color: '#454652' }}>
              {t(TAB_LABEL[key], lang)} <span className="text-xs ml-1 opacity-60">({counts[key]})</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)] mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ background: 'rgba(238,238,238,0.5)', color: '#767683' }}>
                <th className="px-8 py-5">{t('user.user_details', lang)}</th>
                <th className="px-6 py-5">{t('common.role', lang)} / {t('common.permissions', lang)}</th>
                <th className="px-6 py-5">{t('user.joined_date', lang)}</th>
                <th className="px-6 py-5">{t('common.status', lang)}</th>
                <th className="px-8 py-5 text-right">{t('common.actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(198,197,212,0.1)' }}>
              {paginated.map((u: any) => {
                const isVerified = u.isEmailVerified;
                const roles = displayRoles(u);

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
                      <div className="flex flex-wrap gap-1.5">
                        {roles.map((name: string) => {
                          const r = ROLE_CONFIG[name] || ROLE_CONFIG.client;
                          return (
                            <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: r.bg, color: r.color }}>
                              <span className="material-symbols-outlined text-[14px]">{r.icon}</span>
                              {r.label}
                            </span>
                          );
                        })}
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
                        {isVerified ? t('common.verified', lang) : t('common.pending', lang)}
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
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-sm" style={{ color: '#454652' }}>
                    {t('common.no_results', lang)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 flex items-center justify-between border-t" style={{ background: 'rgba(238,238,238,0.3)', borderColor: 'rgba(198,197,212,0.1)' }}>
          <p className="text-sm font-medium" style={{ color: '#454652' }}>
            {t('common.showing', lang)} {filtered.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(safePage * PAGE_SIZE, filtered.length)} {t('common.of', lang)} {filtered.length} {t(TAB_LABEL[activeTab], lang)}
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(s => Math.max(1, s - 1))} disabled={safePage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border transition-colors disabled:opacity-30"
              style={{ borderColor: 'rgba(198,197,212,0.3)', color: '#767683' }}>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {pageNumbers.map((p, i) =>
              typeof p === 'string' ? (
                <span key={`e${i}`} className="px-1 text-xs" style={{ color: '#767683' }}>...</span>
              ) : (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${p === safePage ? 'text-white shadow-md' : 'hover:bg-gray-100'}`}
                  style={p === safePage ? { background: '#000666' } : { color: '#1a1c1c' }}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => setCurrentPage(s => Math.min(totalPages, s + 1))} disabled={safePage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border transition-colors disabled:opacity-30"
              style={{ borderColor: 'rgba(198,197,212,0.3)', color: '#767683' }}>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] text-white flex items-center justify-between" style={{ background: '#000666' }}>
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">{t('user.total_users', lang)}</p>
            <h4 className="text-3xl font-black font-headline">{counts.total.toLocaleString()}</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>
        <div className="p-6 rounded-[2rem] border-2 flex items-center justify-between bg-white" style={{ borderColor: 'rgba(0,6,102,0.05)' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('user.awaiting_review', lang)}</p>
            <h4 className="text-3xl font-black font-headline" style={{ color: '#9f4200' }}>{counts.pending}</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(253,108,0,0.1)', color: '#9f4200' }}>
            <span className="material-symbols-outlined text-2xl">how_to_reg</span>
          </div>
        </div>
        <div className="p-6 rounded-[2rem] border-2 flex items-center justify-between bg-white" style={{ borderColor: 'rgba(0,6,102,0.05)' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('user.growth_mtd', lang)}</p>
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
