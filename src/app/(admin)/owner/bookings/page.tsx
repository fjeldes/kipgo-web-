'use client';

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { t, useLang } from "@/lib/i18n";
import { api } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

const PAGE_SIZE = 15;

const STATUS_GROUPS = ['all', 'active', 'completed', 'cancelled'] as const;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function groupByMonth(items: any[]) {
  const groups: Record<string, any[]> = {};
  for (const b of items) {
    const d = new Date(b.createdAt);
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(b);
  }
  return groups;
}

export default function OwnerBookingsPage() {
  const { token } = useAuth();
  const lang = useLang();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: bookings, loading, error, refetch } = useAdminApi(
    () => {
      if (!token) return Promise.resolve([]);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('limit', '200');
      return api.get<any[]>(`/bookings/me?${params}`, token).then(r => r || []);
    },
    [token, statusFilter],
  );

  const grouped = useMemo(() => groupByMonth(bookings || []), [bookings]);
  const months = Object.keys(grouped).sort((a, b) => {
    const ma = MONTHS.indexOf(a.split(' ')[0]);
    const mb = MONTHS.indexOf(b.split(' ')[0]);
    return mb - ma || parseInt(b.split(' ')[1]) - parseInt(a.split(' ')[1]);
  });

  const allItems = useMemo(() => {
    const items: any[] = [];
    for (const m of months) {
      for (const b of grouped[m]) {
        items.push({ ...b, _month: m });
      }
    }
    return items;
  }, [grouped, months]);

  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = allItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [statusFilter]);

  if (loading) return <LoadingSpinner text="Loading bookings..." />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#000666' }}>{t('nav.bookings', lang)}</h1>
        <p className="font-medium" style={{ color: '#454652' }}>{t('owner.bookings_manage', lang)}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8">
        {STATUS_GROUPS.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? 'text-white shadow-md' : ''}`}
            style={statusFilter === s ? { background: 'linear-gradient(135deg, #000666, #1a237e)' } : { background: '#f3f3f3', color: '#454652' }}>
            {s === 'all' ? t('common.all', lang) : t(`common.${s}`, lang)}
          </button>
        ))}
        <span className="ml-auto text-xs font-medium self-center" style={{ color: '#454652' }}>{(bookings || []).length} {t('common.total', lang)}</span>
      </div>
      {(bookings || []).length === 0 ? (
        <EmptyState message={t('owner.no_bookings', lang)} />
      ) : (
        <div className="space-y-8">
          {months.map((month) => {
            const items = grouped[month];
            return (
              <div key={month}>
                <h3 className="text-sm font-bold mb-4 px-1" style={{ color: '#000666' }}>{month} <span className="font-normal" style={{ color: '#454652' }}>({items.length})</span></h3>
                <div className="rounded-2xl bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: '#eeeeee', color: '#454652' }}>
                          <th className="pb-4 px-4 pt-4">{t('common.store', lang)}</th>
                          <th className="pb-4 px-4 pt-4">{t('common.customer', lang)}</th>
                          <th className="pb-4 px-4 pt-4">{t('common.status', lang)}</th>
                          <th className="pb-4 px-4 pt-4">Items</th>
                          <th className="pb-4 px-4 pt-4">{t('common.date', lang)}</th>
                          <th className="pb-4 px-4 pt-4 text-right">{t('common.total', lang)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((b: any) => (
                          <tr key={b.id} className="border-b transition-colors hover:opacity-80" style={{ borderColor: '#f3f3f3' }}>
                            <td className="py-4 px-4">
                              <span className="font-medium text-xs" style={{ color: '#000666' }}>{b.location?.name || '—'}</span>
                            </td>
                            <td className="py-4 px-4 font-medium text-sm" style={{ color: '#1a1c1c' }}>{b.user?.profile?.firstName || b.user?.name || 'Guest'}</td>
                            <td className="py-4 px-4">
                              <StatusBadge status={b.status} />
                            </td>
                            <td className="py-4 px-4 text-sm" style={{ color: '#454652' }}>{b.items ? `${b.items.small || 0}S ${b.items.medium || 0}M ${b.items.large || 0}L` : '—'}</td>
                            <td className="py-4 px-4 text-sm" style={{ color: '#454652' }}>
                              {b.startDate ? new Date(b.startDate).toLocaleDateString() : '—'}
                            </td>
                            <td className="py-4 px-4 text-right font-bold" style={{ color: '#000666' }}>${Number(b.totalPrice).toFixed(0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium" style={{ color: '#454652' }}>
              {t('common.showing', lang)} {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, allItems.length)} {t('common.of', lang)} {allItems.length}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-white shadow-sm hover:bg-[#000666] hover:text-white transition-all disabled:opacity-30">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-white shadow-sm hover:bg-[#000666] hover:text-white transition-all disabled:opacity-30">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
