'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import { ArrowLeft, Store, Plus, X } from "lucide-react";

export default function NewStorePage() {
  const { token } = useAuth();
  const router = useRouter();
  const lang = useLang();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', address: '', lat: '', lng: '',
    smallCapacity: '10', mediumCapacity: '10', largeCapacity: '5',
    smallPrice: '5', mediumPrice: '8', largePrice: '12',
    currency: 'USD', description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.address.trim()) errs.address = 'Required';
    if (!form.lat) errs.lat = 'Required';
    if (!form.lng) errs.lng = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;
    setLoading(true);
    try {
      await api.post('/locations', {
        name: form.name,
        address: form.address,
        lat: form.lat,
        lng: form.lng,
        description: form.description,
        smallCapacity: form.smallCapacity,
        mediumCapacity: form.mediumCapacity,
        largeCapacity: form.largeCapacity,
        smallPrice: form.smallPrice,
        mediumPrice: form.mediumPrice,
        largePrice: form.largePrice,
        currency: form.currency,
      }, token);
      toast('success', 'Store created successfully');
      router.push('/super/bookings');
    } catch (err: any) {
      toast('error', err.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: string, opts?: { type?: string; placeholder?: string; suffix?: string }) => (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: '#454652' }}>{label}</label>
      <div className="relative">
        <input type={opts?.type || 'text'} value={(form as any)[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={opts?.placeholder}
          className={`w-full bg-[#f3f3f3] border-none rounded-xl py-2.5 px-4 text-sm outline-none transition ${errors[key] ? 'ring-2 ring-red-300' : ''}`} style={{ color: '#1a1c1c' }} />
        {opts?.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#767683' }}>{opts.suffix}</span>}
      </div>
      {errors[key] && <p className="text-[10px] mt-1 text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/super/bookings" className="p-2 rounded-xl hover:bg-white transition-colors" style={{ color: '#454652' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl sm:text-3xl font-headline font-extrabold tracking-tight" style={{ color: '#000666' }}>{t('store.register_new', lang)}</h2>
          <p className="text-sm mt-1" style={{ color: '#454652' }}>Add a new storage location to the network</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-4 sm:p-8 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-headline font-bold mb-4" style={{ color: '#000666' }}>Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('Store Name', 'name', { placeholder: 'Central Station Hub' })}
            {field('Currency', 'currency', { placeholder: 'USD' })}
          </div>
          {field('Address', 'address', { placeholder: '123 Main St, City, Country' })}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {field('Latitude', 'lat', { type: 'number', placeholder: '-33.4489' })}
            {field('Longitude', 'lng', { type: 'number', placeholder: '-70.6693' })}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-bold mb-1.5" style={{ color: '#454652' }}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Optional description of the location"
              className="w-full bg-[#f3f3f3] border-none rounded-xl py-2.5 px-4 text-sm outline-none" style={{ color: '#1a1c1c' }} />
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(198,197,212,0.2)' }} />

        {/* Capacity */}
        <div>
          <h3 className="text-lg font-headline font-bold mb-4" style={{ color: '#000666' }}>Capacity</h3>
          <div className="grid grid-cols-3 gap-4">
            {field('Small (units)', 'smallCapacity', { type: 'number', suffix: 'slots' })}
            {field('Medium (units)', 'mediumCapacity', { type: 'number', suffix: 'slots' })}
            {field('Large (units)', 'largeCapacity', { type: 'number', suffix: 'slots' })}
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(198,197,212,0.2)' }} />

        {/* Pricing */}
        <div>
          <h3 className="text-lg font-headline font-bold mb-4" style={{ color: '#000666' }}>Pricing</h3>
          <div className="grid grid-cols-3 gap-4">
            {field('Small ($/day)', 'smallPrice', { type: 'number', suffix: form.currency })}
            {field('Medium ($/day)', 'mediumPrice', { type: 'number', suffix: form.currency })}
            {field('Large ($/day)', 'largePrice', { type: 'number', suffix: form.currency })}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 transition-all"
          style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
          {loading ? 'Creating...' : <><Plus size={18} /> Create Store</>}
        </button>
      </form>
    </div>
  );
}
