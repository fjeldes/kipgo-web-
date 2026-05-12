'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, DollarSign, LogOut, Menu, X } from "lucide-react";

function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isSuper = !user?.roles?.includes('owner');
  const nav = isSuper
    ? [
        { href: '/super/payouts', label: 'Payouts', icon: DollarSign },
        { href: '/super/owners', label: 'Owners', icon: Users },
        { href: '/super/bookings', label: 'Bookings', icon: Briefcase },
      ]
    : [
        { href: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/owner/bookings', label: 'Bookings', icon: Briefcase },
        { href: '/owner/staff', label: 'Staff', icon: Users },
      ];

  return (
    <>
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white shadow-lg" onClick={() => setOpen(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#000666] to-[#1a237e]">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <span className="font-headline font-bold" style={{ color: '#1a1c1c' }}>Admin</span>
        </div>

        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
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
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition" style={{ color: '#dc2626' }}>
            <LogOut size={18} />
            Logout
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

  if (isOwnerPage) return <>{children}</>;
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
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
