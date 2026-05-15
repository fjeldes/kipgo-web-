import { ReactNode } from "react";
import { COLORS } from "@/lib/constants";

interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl p-12 text-center bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)]" style={{ color: COLORS.onSurfaceVariant }}>
      {icon && <div className="mx-auto mb-4 opacity-40">{icon}</div>}
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#000666] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
