'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, DollarSign, LogOut, Menu, X, MessageSquareWarning, Bug, Store, UserCog, Calendar, TrendingUp, Globe, Percent } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";
import { t, detectLang, type Lang } from "@/lib/i18n";

function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('admin_lang') as Lang | null;
    setLang(stored || detectLang());
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    localStorage.setItem('admin_lang', next);
  };

  const isSuper = !user?.roles?.includes('owner');
  const nav = isSuper
    ? [
        { href: '/super', label: t('nav.global_overview', lang), icon: LayoutDashboard },
        { href: '/super/stores', label: t('nav.stores', lang), icon: Store },
        { href: '/super/owners', label: t('nav.user_management', lang), icon: Users },
        { href: '/super/bookings', label: t('nav.store_directory', lang), icon: Calendar },
        { href: '/super/payouts', label: t('nav.financials', lang), icon: DollarSign },
        { href: '/super/claims', label: t('nav.claims', lang), icon: MessageSquareWarning },
        { href: '/super/promos', label: t('nav.promos', lang), icon: Percent },
        { href: '/super/errors', label: t('nav.error_logs', lang), icon: Bug },
      ]
    : [
        { href: '/owner/dashboard', label: t('nav.dashboard', lang), icon: LayoutDashboard },
        { href: '/owner/stores', label: t('nav.stores', lang), icon: Store },
        { href: '/owner/bookings', label: t('nav.bookings', lang), icon: Calendar },
        { href: '/owner/financials', label: t('nav.financials', lang), icon: TrendingUp },
        { href: '/owner/staff', label: t('nav.staff', lang), icon: UserCog },
      ];

  return (
    <>
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white shadow-lg" onClick={() => setOpen(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="KipGo" className="h-8 w-auto" />
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            const active = item.href === '/super' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  active ? 'text-white' : ''
                }`}
                style={active ? { background: 'linear-gradient(135deg, #000666, #1a237e)' } : { color: '#454652' }}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-[#000666] to-[#1a237e]">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#1a1c1c' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: '#454652' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={toggleLang} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition mb-1" style={{ color: '#454652' }}>
            <Globe size={18} />
            {lang === 'en' ? t('lang.es', lang) : t('lang.en', lang)}
          </button>
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition" style={{ color: '#dc2626' }}>
            <LogOut size={18} />
            {t('nav.logout', lang)}
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login' && pathname !== '/change-password') {
      router.push('/login');
    }
    if (!isLoading && user && pathname.startsWith('/super') && user.roles?.includes('owner')) {
      router.push('/owner/dashboard');
    }
    if (!isLoading && user && pathname.startsWith('/owner') && !user.roles?.includes('owner')) {
      router.push('/super');
    }
  }, [user, isLoading, pathname, router]);

  if (pathname === '/login' || pathname === '/change-password') return <>{children}</>;

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="w-8 h-8 border-2 border-[#000666] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  const isOwnerPage = pathname.startsWith('/owner');
  const isSuperPage = pathname.startsWith('/super');

  if (isOwnerPage) return (
    <div className="flex h-screen bg-[#f9f9f9]">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
  if (isSuperPage) return (
    <div className="flex h-screen bg-[#f9f9f9]">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 overflow-auto p-8">
        {children}
      </main>
    </div>
  );

  // fallback: redirect based on role
  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <ToastProvider>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </ToastProvider>
      </ErrorBoundary>
    </AuthProvider>
  );
}
