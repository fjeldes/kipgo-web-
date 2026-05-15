export function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-t-[#000666] border-[#E2E8F0] rounded-full animate-spin" />
      <p className="text-sm font-medium" style={{ color: '#454652' }}>{text}</p>
    </div>
  );
}
