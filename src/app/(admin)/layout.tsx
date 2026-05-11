'use client';

import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') router.push('/login');
  }, [user, isLoading, pathname, router]);

  if (pathname === '/login') return <>{children}</>;

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="w-8 h-8 border-2 border-[#000666] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
