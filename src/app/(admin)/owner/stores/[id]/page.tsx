'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import Link from "next/link";
import { ArrowLeft, MapPin, Package, DollarSign, CheckCircle, XCircle, Edit3, Save, X } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { useToast } from "@/components/ui/Toast";

export default function OwnerStoreDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const lang = useLang();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  const { data: store, loading, error, refetch } = useAdminApi(
    () => token && id ? api.get<any>(`/locations/${id}`, token) : Promise.resolve(null),
    [token, id],
  );

  const { data: reviews } = useAdminApi<any[]>(
    () => id ? api.get<any[]>(`/reviews/location/${id}`).then(r => r || []) : Promise.resolve([]),
    [id],
  );

  useEffect(() => {
    if (store) {
      setForm({ name: store.name, description: store.description, address: store.address });
    }
  }, [store]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const updated = await api.patch<any>(`/locations/${id}`, form, token);
      refetch();
      setEditing(false);
    } catch (err) {
      toast('error', (err as any)?.message || 'Something went wrong');
    }
    setSaving(false);
  };

  if (loading) return <LoadingSpinner text="Loading store..." />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  if (!store) return (
    <div className="text-center py-16">
      <p className="text-lg font-bold" style={{ color: '#1a1c1c' }}>{t('common.not_found', lang)}</p>
      <Link href="/owner/stores" className="text-sm mt-2 inline-block hover:underline" style={{ color: '#000666' }}>← {t('store.back_to_directory', lang)}</Link>
    </div>
  );

  const totalCap = (Number(store.capacity?.small) || 0) + (Number(store.capacity?.medium) || 0) + (Number(store.capacity?.large) || 0);
  const totalOcc = (Number(store.occupied?.small) || 0) + (Number(store.occupied?.medium) || 0) + (Number(store.occupied?.large) || 0);
  const totalAvail = (Number(store.availability?.small) || 0) + (Number(store.availability?.medium) || 0) + (Number(store.availability?.large) || 0);
  const occPct = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;
  const sizes = ['small', 'medium', 'large'] as const;
  const sizeLabels: Record<string, string> = { small: t('store.items_small', lang), medium: t('store.items_medium', lang), large: t('store.items_large', lang) };
  const allReviews = reviews || [];
  const avgRating = allReviews.length > 0 ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length : 0;

  return (
    <div>
      {/* Breadcrumb + Edit */}
      <nav className="flex items-center justify-between mb-6">
        <Link href="/owner/stores" className="text-xs font-bold uppercase tracking-widest hover:underline" style={{ color: '#000666' }}>
          <ArrowLeft size={14} className="inline mr-1" /> {t('store.back_to_directory', lang)}
        </Link>
        <button onClick={() => editing ? handleSave() : setEditing(true)} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
          {editing ? <><Save size={14} /> {saving ? '...' : t('common.save', lang)}</> : <><Edit3 size={14} /> {t('common.edit', lang)}</>}
        </button>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-6 mb-6 sm:mb-10">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0" style={{ background: 'rgba(0,6,102,0.05)' }}>🏪</div>
        <div className="flex-1">
          {editing ? (
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="text-2xl sm:text-4xl font-headline font-extrabold tracking-tight w-full bg-[#f3f3f3] border-none rounded-xl py-2 px-4 outline-none" style={{ color: '#000666' }} />
          ) : (
            <h2 className="text-2xl sm:text-4xl font-headline font-extrabold tracking-tight" style={{ color: '#000666' }}>{store.name}</h2>
          )}
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-sm" style={{ color: '#454652' }}>
              <MapPin size={14} /> {store.city}, {store.country}
            </span>
            <span className="text-sm" style={{ color: '#454652' }}>{store.address}</span>
          </div>
          {editing ? (
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="text-sm mt-3 w-full max-w-2xl bg-[#f3f3f3] border-none rounded-xl py-2 px-4 outline-none" rows={3} style={{ color: '#454652' }} />
          ) : store.description && (
            <p className="text-sm mt-3 max-w-2xl" style={{ color: '#454652' }}>{store.description}</p>
          )}
          {editing && (
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="text-sm mt-2 w-full max-w-2xl bg-[#f3f3f3] border-none rounded-xl py-2 px-4 outline-none" style={{ color: '#454652' }} />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: '#e0e0ff' }}><Package size={18} style={{ color: '#000666' }} /></div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('store.total_capacity', lang)}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-headline font-extrabold" style={{ color: '#000666' }}>{totalCap}</p>
          <p className="text-xs mt-1" style={{ color: '#454652' }}>{t('common.slots', lang)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: '#ffdbcb' }}><XCircle size={18} style={{ color: '#9f4200' }} /></div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('common.occupied', lang)}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-headline font-extrabold" style={{ color: '#9f4200' }}>{totalOcc}</p>
          <p className="text-xs mt-1" style={{ color: '#454652' }}>{occPct}% {t('common.of', lang)} {t('common.total', lang)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: '#d9e2ff' }}><CheckCircle size={18} style={{ color: '#001944' }} /></div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('common.available', lang)}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-headline font-extrabold" style={{ color: '#001944' }}>{totalAvail}</p>
          <p className="text-xs mt-1" style={{ color: '#454652' }}>{100 - occPct}% {t('common.free', lang)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: '#e0e0ff' }}><DollarSign size={18} style={{ color: '#000666' }} /></div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('store.price_per_day', lang)}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-headline font-extrabold" style={{ color: '#000666' }}>{store.currency || 'USD'} {store.pricePerDay?.small || 0}</p>
          <p className="text-xs mt-1" style={{ color: '#454652' }}>{t('store.from_small', lang)}</p>
        </div>
      </div>

      {/* Capacity */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)] mb-8">
        <div className="p-4 sm:p-8 border-b" style={{ borderColor: '#f3f3f3' }}>
          <h3 className="text-xl font-headline font-bold" style={{ color: '#000666' }}>{t('store.capacity_breakdown', lang)}</h3>
          <p className="text-sm mt-1" style={{ color: '#454652' }}>{t('store.capacity_by_size', lang)}</p>
        </div>
        <div className="p-4 sm:p-8">
          <div className="space-y-6">
            {sizes.map((size) => {
              const cap = Number(store.capacity?.[size]) || 0;
              const occ = Number(store.occupied?.[size]) || 0;
              const avail = Number(store.availability?.[size]) || 0;
              const pct = cap > 0 ? Math.round((occ / cap) * 100) : 0;
              return (
                <div key={size}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: '#1a1c1c' }}>{sizeLabels[size]}</span>
                    <span className="text-xs font-medium" style={{ color: '#454652' }}>{occ}/{cap} {t('common.occupied', lang)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#f3f3f3' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? '#dc2626' : '#000666' }} />
                    </div>
                    <span className="text-xs font-bold min-w-[4rem] text-right" style={{ color: pct > 80 ? '#dc2626' : '#000666' }}>{avail} {t('common.free', lang)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)] mb-8">
        <div className="p-4 sm:p-8 border-b" style={{ borderColor: '#f3f3f3' }}>
          <h3 className="text-xl font-headline font-bold" style={{ color: '#000666' }}>{t('store.pricing', lang)}</h3>
          <p className="text-sm mt-1" style={{ color: '#454652' }}>{t('store.daily_rates', lang)}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase font-extrabold tracking-widest" style={{ background: '#f3f3f3', color: '#454652' }}>
              <tr>
                <th className="px-4 sm:px-8 py-4">{t('common.type', lang)}</th>
                <th className="px-4 sm:px-8 py-4">{t('store.price_per_day', lang)}</th>
                <th className="px-4 sm:px-8 py-4">{t('common.capacity', lang)}</th>
                <th className="px-4 sm:px-8 py-4">{t('common.occupied', lang)}</th>
                <th className="px-4 sm:px-8 py-4">{t('common.available', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#f3f3f3' }}>
              {sizes.map((size) => (
                <tr key={size} className="hover:bg-[#f3f3f3]/30 transition-colors">
                  <td className="px-3 sm:px-8 py-3 sm:py-5 font-semibold" style={{ color: '#1a1c1c' }}>{sizeLabels[size]}</td>
                  <td className="px-3 sm:px-8 py-3 sm:py-5 font-bold" style={{ color: '#000666' }}>{store.currency || 'USD'} {store.pricePerDay?.[size] || 0}</td>
                  <td className="px-3 sm:px-8 py-3 sm:py-5" style={{ color: '#1a1c1c' }}>{store.capacity?.[size] || 0}</td>
                  <td className="px-3 sm:px-8 py-3 sm:py-5" style={{ color: '#9f4200' }}>{store.occupied?.[size] || 0}</td>
                  <td className="px-3 sm:px-8 py-3 sm:py-5 font-bold" style={{ color: '#001944' }}>{store.availability?.[size] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
        <div className="p-4 sm:p-8 border-b" style={{ borderColor: '#f3f3f3' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-headline font-bold" style={{ color: '#000666' }}>{t('store.reviews', lang)}</h3>
              <p className="text-sm mt-1" style={{ color: '#454652' }}>{t('store.customer_feedback', lang)}</p>
            </div>
            {allReviews.length > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-sm font-bold" style={{ color: '#1a1c1c' }}>{avgRating.toFixed(1)}</span>
                <span className="text-xs" style={{ color: '#454652' }}>({allReviews.length})</span>
              </div>
            )}
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: '#f3f3f3' }}>
          {allReviews.map((r: any) => (
            <div key={r.id} className="p-4 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                  {(r.user?.profile?.firstName?.[0] || r.user?.name?.[0] || 'U').toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold" style={{ color: '#1a1c1c' }}>{r.user?.profile?.firstName || r.user?.name || 'Anonymous'}</span>
                    <StarRating rating={r.rating} />
                    <span className="text-xs ml-auto" style={{ color: '#767683' }}>{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {r.comment && <p className="text-sm mt-2" style={{ color: '#454652' }}>{r.comment}</p>}
                </div>
              </div>
            </div>
          ))}
          {allReviews.length === 0 && (
            <div className="p-12 text-center text-sm" style={{ color: '#454652' }}>{t('store.no_reviews', lang)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
