import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  pageSize?: number;
}

export function Pagination({ page, totalPages, onPageChange, total, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = total && pageSize ? (page - 1) * pageSize + 1 : 0;
  const to = total && pageSize ? Math.min(page * pageSize, total) : 0;

  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="p-6 flex items-center justify-between border-t" style={{ background: 'rgba(238,238,238,0.3)', borderColor: 'rgba(198,197,212,0.1)' }}>
      {total !== undefined && (
        <p className="text-xs" style={{ color: '#454652' }}>
          Showing {from}-{to} of {total}
        </p>
      )}
      <div className="flex items-center gap-1.5">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-white shadow-sm hover:bg-[#000666] hover:text-white transition-all disabled:opacity-30">
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          typeof p === 'string' ? (
            <span key={`e${i}`} className="px-1 text-xs" style={{ color: '#767683' }}>...</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${p === page ? 'text-white shadow-md' : 'bg-white shadow-sm hover:bg-[#000666] hover:text-white'}`}
              style={p === page ? { background: '#000666' } : {}}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-white shadow-sm hover:bg-[#000666] hover:text-white transition-all disabled:opacity-30">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
