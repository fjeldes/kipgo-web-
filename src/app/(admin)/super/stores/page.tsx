'use client';

import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

type StoreStatus = 'pending' | 'active' | 'rejected';

export default function SuperStores() {
  const { token } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const { data: stores, loading, error, refetch } = useAdminApi(
    () => api.get<any[]>('/locations/admin/all', token || undefined).then(r => r || []),
    [token],
  );

  const updateStatus = async (id: string, status: StoreStatus) => {
    try {
      await api.patch(`/locations/${id}/status`, { status }, token || undefined);
      refetch();
      toast('success', `Store ${status}`);
    } catch {
      toast('error', 'Could not update store status');
    }
  };

  if (loading) return <LoadingSpinner text="Loading stores..." />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  const pending = (stores || []).filter((s: any) => s.status === 'pending');
  const active = (stores || []).filter((s: any) => s.status === 'active');
  const rejected = (stores || []).filter((s: any) => s.status === 'rejected');

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight" style={{ color: '#000666' }}>Store Approvals</h2>
          <p className="text-sm mt-1" style={{ color: '#454652' }}>{pending.length} pending approval</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending</p>
          <p className="text-2xl font-black text-amber-800">{pending.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-xs font-bold uppercase tracking-wider text-green-700">Active</p>
          <p className="text-2xl font-black text-green-800">{active.length}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <p className="text-xs font-bold uppercase tracking-wider text-red-700">Rejected</p>
          <p className="text-2xl font-black text-red-800">{rejected.length}</p>
        </div>
      </div>

      {/* Pending Stores */}
      {pending.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[0px_20px_40px_rgba(26,35,126,0.04)] overflow-hidden mb-8">
          <div className="p-6 border-b" style={{ borderColor: '#f3f3f3' }}>
            <h3 className="text-lg font-bold" style={{ color: '#000666' }}>Pending Approval</h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#f3f3f3' }}>
            {pending.map((store: any) => (
              <div key={store.id} className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`/super/stores/${store.id}`)}>
                <div>
                  <p className="font-bold" style={{ color: '#1a1c1c' }}>{store.name}</p>
                  <p className="text-xs" style={{ color: '#454652' }}>{store.address} • {store.city}</p>
                  <p className="text-xs mt-1" style={{ color: '#767683' }}>Capacity: S:{store.capacity?.small || 0} M:{store.capacity?.medium || 0} L:{store.capacity?.large || 0}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(store.id, 'active')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
                    Approve
                  </button>
                  <button onClick={() => updateStatus(store.id, 'rejected')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Stores */}
      {active.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[0px_20px_40px_rgba(26,35,126,0.04)] overflow-hidden">
          <div className="p-6 border-b" style={{ borderColor: '#f3f3f3' }}>
            <h3 className="text-lg font-bold" style={{ color: '#000666' }}>Active Stores</h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#f3f3f3' }}>
            {active.map((store: any) => (
              <div key={store.id} className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`/super/stores/${store.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-bold" style={{ color: '#1a1c1c' }}>{store.name}</p>
                    <p className="text-xs" style={{ color: '#454652' }}>{store.city}</p>
                  </div>
                </div>
                <button onClick={() => updateStatus(store.id, 'pending')}
                  className="px-3 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                  Set Pending
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {stores?.length === 0 && (
        <div className="text-center py-20 text-sm" style={{ color: '#767683' }}>No stores registered yet.</div>
      )}
    </div>
  );
}
