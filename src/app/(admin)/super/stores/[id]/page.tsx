'use client';

import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { useParams, useRouter } from "next/navigation";

export default function StoreDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const toast = useToast();

  const { data: store, loading, error, refetch } = useAdminApi(
    () => api.get<any>(`/locations/admin/${id}`, token || undefined),
    [id, token],
  );

  const updateStatus = async (status: 'active' | 'rejected') => {
    try {
      await api.patch(`/locations/${id}/status`, { status }, token || undefined);
      refetch();
      toast('success', `Store ${status}`);
    } catch {
      toast('error', 'Could not update store');
    }
  };

  if (loading) return <LoadingSpinner text="Loading store..." />;
  if (error) return <ErrorAlert message={error} />;
  if (!store) return <LoadingSpinner text="Loading..." />;

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    active: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => router.push('/super/stores')} className="flex items-center gap-2 text-sm font-bold mb-6 hover:opacity-70" style={{ color: '#454652' }}>
        ← Back to Stores
      </button>

      <div className="bg-white rounded-2xl shadow-[0px_20px_40px_rgba(26,35,126,0.04)] overflow-hidden">
        <div className="p-8 border-b" style={{ borderColor: '#f3f3f3' }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-headline font-extrabold" style={{ color: '#000666' }}>{store.name}</h1>
              <p className="text-sm mt-1" style={{ color: '#454652' }}>{store.address}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[store.status] || 'bg-gray-100 text-gray-800'}`}>
              {store.status?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#767683' }}>City</p>
              <p className="font-semibold" style={{ color: '#1a1c1c' }}>{store.city}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#767683' }}>Country</p>
              <p className="font-semibold" style={{ color: '#1a1c1c' }}>{store.country}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#767683' }}>Coordinates</p>
              <p className="font-semibold" style={{ color: '#1a1c1c' }}>{store.lat}, {store.lng}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#767683' }}>Currency</p>
              <p className="font-semibold" style={{ color: '#1a1c1c' }}>{store.currency}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#767683' }}>Pricing (per day)</p>
            <div className="grid grid-cols-3 gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <div key={size} className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-bold uppercase" style={{ color: '#767683' }}>{size}</p>
                  <p className="text-xl font-black mt-1" style={{ color: '#000666' }}>${store.pricePerDay?.[size] || 0}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#767683' }}>Capacity</p>
            <div className="grid grid-cols-3 gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <div key={size} className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-bold uppercase" style={{ color: '#767683' }}>{size}</p>
                  <p className="text-xl font-black mt-1" style={{ color: '#000666' }}>{store.capacity?.[size] || 0}</p>
                </div>
              ))}
            </div>
          </div>

          {store.description && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#767683' }}>Description</p>
              <p style={{ color: '#454652' }}>{store.description}</p>
            </div>
          )}

          {store.owners && store.owners.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#767683' }}>Store Owner</p>
              {store.owners.map((owner: any, i: number) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold" style={{ color: '#1a1c1c' }}>{owner.name}</p>
                    <p className="text-sm" style={{ color: '#454652' }}>{owner.email}</p>
                  </div>
                  {owner.email && (
                    <a href={`mailto:${owner.email}`} className="px-4 py-2 bg-white rounded-lg text-sm font-bold border hover:bg-gray-100 transition-colors" style={{ color: '#000666', borderColor: '#e2e8f0' }}>
                      Contact Owner
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {store.status !== 'active' && (
          <div className="p-8 bg-gray-50 border-t flex gap-3" style={{ borderColor: '#f3f3f3' }}>
            <button onClick={() => updateStatus('active')}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors">
              Approve Store
            </button>
            <button onClick={() => updateStatus('rejected')}
              className="flex-1 py-3 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition-colors">
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
