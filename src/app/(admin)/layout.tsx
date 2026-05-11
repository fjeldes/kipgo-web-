'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Briefcase, Users, DollarSign, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isSuper = user?.roles?.includes('owner') === false;
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
      {/* Mobile toggle */}
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow" onClick={() => setOpen(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <span className="font-bold text-blue-900">Admin</span>
        </div>

        <nav className="p-4 space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  active ? 'bg-blue-50 text-blue-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
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
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  if (pathname === '/login') return <>{children}</>;

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  const isSuper = !user.roles?.includes('owner');

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 overflow-auto bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
