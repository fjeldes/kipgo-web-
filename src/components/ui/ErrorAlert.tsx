export function ErrorAlert({ message, onRetry }: { message?: string | null; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 px-6">
      <span className="material-symbols-outlined text-5xl" style={{ color: '#dc2626' }}>error_outline</span>
      <p className="text-base font-semibold text-center" style={{ color: '#1a1c1c' }}>
        {message || 'Something went wrong'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl text-white font-bold transition-colors hover:opacity-90"
          style={{ background: '#000666' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
