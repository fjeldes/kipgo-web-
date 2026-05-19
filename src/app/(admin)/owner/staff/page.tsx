'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { UserCog, X, Mail, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { useToast } from "@/components/ui/Toast";

export default function OwnerStaffPage() {
  const { token } = useAuth();
  const lang = useLang();
  const toast = useToast();
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');

  const { data: stores, loading: storesLoading, error: storesError, refetch: refetchStores } = useAdminApi(
    () => token ? api.get<any[]>('/locations/me', token).then(r => r || []) : Promise.resolve([]),
    [token],
  );

  const { data: staff, loading: staffLoading, error: staffError, refetch: refetchStaff } = useAdminApi(
    () => token && selectedStore ? api.get<any[]>(`/staff/location/${selectedStore}`, token).then(r => r || []) : Promise.resolve([]),
    [token, selectedStore],
  );

  useEffect(() => {
    if (stores && stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0].id);
    }
  }, [stores]);

  const handleInvite = async () => {
    if (!token || !selectedStore || !inviteEmail) return;
    try {
      await api.post('/staff/invite', { locationId: selectedStore, email: inviteEmail, name: inviteName || inviteEmail.split('@')[0] }, token);
      setShowInvite(false);
      setInviteEmail('');
      setInviteName('');
      refetchStaff();
    } catch { /* ignore */ }
  };

  const handleRemove = async (id: string) => {
    if (!token) return;
    try {
      await api.delete(`/staff/${id}`, token);
      refetchStaff();
    } catch (err) {
      toast('error', (err as any)?.message || 'Something went wrong');
    }
  };

  if (storesLoading) return <LoadingSpinner text="Loading stores..." />;
  if (storesError) return <ErrorAlert message={storesError} onRetry={refetchStores} />;

  return (
    <div>
      <div className="flex justify-between items-end mb-6 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#000666' }}>{t('nav.staff', lang)}</h2>
          <p className="font-medium" style={{ color: '#454652' }}>{t('owner.manage_team', lang)}</p>
        </div>
        <button onClick={() => setShowInvite(true)} disabled={!selectedStore}
          className="flex items-center gap-2 text-white px-4 sm:px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
          <Plus size={18} />
          {t('staff.invite_member', lang)}
        </button>
      </div>

      {/* Store selector */}
      {(stores || []).length > 0 && (
        <div className="flex gap-2 mb-8">
          {(stores || []).map((s: any) => (
            <button key={s.id} onClick={() => setSelectedStore(s.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedStore === s.id ? 'text-white shadow-md' : ''}`}
              style={selectedStore === s.id ? { background: 'linear-gradient(135deg, #000666, #1a237e)' } : { background: '#f3f3f3', color: '#454652' }}>
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Staff list */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
        {!selectedStore ? (
          <EmptyState icon={<UserCog size={40} />} message={t('staff.select_store', lang)} />
        ) : (staff || []).length === 0 ? (
          <EmptyState icon={<UserCog size={40} />} message={t('staff.no_staff', lang)} />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ background: 'rgba(238,238,238,0.5)', color: '#767683' }}>
              <tr>
                <th className="px-3 sm:px-8 py-3 sm:py-5">{t('common.name', lang)}</th>
                <th className="px-3 sm:px-6 py-3 sm:py-5">{t('common.email', lang)}</th>
                <th className="px-3 sm:px-6 py-3 sm:py-5">{t('common.permissions', lang)}</th>
                <th className="px-3 sm:px-6 py-3 sm:py-5">{t('common.assigned', lang)}</th>
                <th className="px-3 sm:px-8 py-3 sm:py-5 text-right">{t('common.actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(198,197,212,0.1)' }}>
              {(staff || []).map((s: any) => (
                <tr key={s.id} className="hover:opacity-80 transition-opacity">
                  <td className="px-3 sm:px-8 py-3 sm:py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                        {(s.staff?.profile?.firstName?.[0] || s.staff?.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <span className="font-bold text-sm" style={{ color: '#1a1c1c' }}>{s.staff?.profile?.firstName || s.staff?.name || 'Staff'}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-5 text-sm" style={{ color: '#454652' }}>{s.staff?.email || '—'}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-5">
                    <div className="flex gap-1">
                      {(s.permissions || ['check_in', 'check_out']).map((p: string) => (
                        <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,6,102,0.05)', color: '#000666' }}>{p.replace('_', ' ')}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-5 text-xs" style={{ color: '#767683' }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-3 sm:px-8 py-3 sm:py-5 text-right">
                    <button onClick={() => handleRemove(s.id)} className="p-2 hover:bg-red-50 rounded-lg transition-all" style={{ color: '#dc2626' }}>
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center" onClick={() => setShowInvite(false)}>
          <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-headline font-bold mb-1" style={{ color: '#000666' }}>{t('staff.invite_member', lang)}</h3>
            <p className="text-sm mb-6" style={{ color: '#454652' }}>{t('staff.invite_desc', lang)}</p>

            <label className="text-xs font-bold mb-1 block" style={{ color: '#454652' }}>{t('common.name', lang)}</label>
            <input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder={t('common.name', lang)}
              className="w-full bg-[#f3f3f3] border-none rounded-xl py-3 px-4 text-sm outline-none mb-4" style={{ color: '#1a1c1c' }} />

            <label className="text-xs font-bold mb-1 block" style={{ color: '#454652' }}>{t('common.email', lang)}</label>
            <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder={t('common.email', lang)} type="email"
              className="w-full bg-[#f3f3f3] border-none rounded-xl py-3 px-4 text-sm outline-none mb-6" style={{ color: '#1a1c1c' }} />

            <div className="flex gap-3">
              <button onClick={() => setShowInvite(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm" style={{ background: '#f3f3f3', color: '#454652' }}>{t('common.cancel', lang)}</button>
              <button onClick={handleInvite} disabled={!inviteEmail}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                <Mail size={16} className="inline mr-1.5" />
                {t('staff.send_invite', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
