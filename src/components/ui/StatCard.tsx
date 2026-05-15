import { ReactNode } from "react";
import { COLORS } from "@/lib/constants";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  dark?: boolean;
}

export function StatCard({ icon, label, value, subtitle, badge, badgeColor, dark }: StatCardProps) {
  return (
    <div className={`${dark ? 'text-white' : 'bg-white'} p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)] flex flex-col justify-between overflow-hidden relative`}
      style={dark ? { background: COLORS.primary } : {}}>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${dark ? 'bg-white/10' : ''}`} style={dark ? {} : { background: COLORS.primaryLight }}>
            {icon}
          </div>
          {badge && (
            <span className="text-xs font-bold" style={{ color: badgeColor || COLORS.secondary }}>{badge}</span>
          )}
        </div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: dark ? 'rgba(255,255,255,0.7)' : COLORS.onSurfaceVariant }}>{label}</p>
        <p className={`text-2xl font-headline font-extrabold mt-1 ${dark ? 'text-white' : ''}`} style={dark ? {} : { color: COLORS.primary }}>{value}</p>
        {subtitle && <p className="text-xs mt-1" style={{ color: dark ? 'rgba(255,255,255,0.5)' : COLORS.onSurfaceVariant }}>{subtitle}</p>}
      </div>
    </div>
  );
}

interface StatGridProps {
  children: ReactNode;
  cols?: number;
}

export function StatGrid({ children, cols = 4 }: StatGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-6 mb-10`}>
      {children}
    </div>
  );
}
