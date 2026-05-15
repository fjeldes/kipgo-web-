interface BadgeProps {
  children: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const VARIANTS: Record<string, { bg: string; color: string }> = {
  success: { bg: 'bg-green-50', color: 'text-green-700' },
  warning: { bg: 'bg-amber-50', color: 'text-amber-700' },
  error: { bg: 'bg-red-50', color: 'text-red-700' },
  info: { bg: 'bg-blue-50', color: 'text-blue-700' },
  neutral: { bg: 'bg-gray-50', color: 'text-gray-700' },
};

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const v = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${v.bg} ${v.color}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === 'confirmed' || status === 'paid' || status === 'succeeded' || status === 'resolved' || status === 'active' ? 'success' :
    status === 'in_storage' || status === 'in_progress' || status === 'pending' ? 'warning' :
    status === 'cancelled' || status === 'failed' || status === 'closed' ? 'error' :
    'neutral';
  return <Badge variant={variant}>{status.replace(/_/g, ' ')}</Badge>;
}
