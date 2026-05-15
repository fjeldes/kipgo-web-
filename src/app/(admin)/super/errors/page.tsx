'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { AlertTriangle, Bug, Server, Globe, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

const LEVEL_COLORS: Record<string, string> = {
  error: '#dc2626',
  fatal: '#7c3aed',
  warn: '#9f4200',
  info: '#1a237e',
};

const LEVEL_BG: Record<string, string> = {
  error: 'rgba(220,38,38,0.1)',
  fatal: 'rgba(124,58,237,0.1)',
  warn: 'rgba(159,66,0,0.1)',
  info: 'rgba(26,35,126,0.1)',
};

export default function SuperErrorLogs() {
  const { token } = useAuth();
  const lang = useLang();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>('');

  const { data: logsData, loading: logsLoading, error: logsError, refetch: refetchLogs } = useAdminApi(
    () => {
      if (!token) return Promise.resolve(null);
      const params = new URLSearchParams({ page: String(page), limit: '25' });
      if (filter) params.set('level', filter);
      return api.get<any>(`/error-logs?${params}`, token);
    },
    [token, page, filter],
  );

  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminApi(
    () => token ? api.get<any>('/error-logs/stats', token) : Promise.resolve(null),
    [token],
  );

  const logs = logsData?.items || [];
  const totalPages = logsData?.totalPages || 1;

  const loading = logsLoading || statsLoading;
  const error = logsError || statsError;

  if (loading) return <LoadingSpinner text="Loading error logs..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => { refetchLogs(); refetchStats(); }} />;

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#1a1c1c' }}>{t('error.error_logs', lang)}</h2>
        <p className="font-medium" style={{ color: '#454652' }}>{t('error.error_logs_desc', lang)}</p>
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(26,35,126,0.03)] text-center">
            <p className="text-2xl font-headline font-extrabold" style={{ color: '#1a1c1c' }}>{stats.total}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#454652' }}>{t('error.all_time', lang)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(26,35,126,0.03)] text-center">
            <p className="text-2xl font-headline font-extrabold" style={{ color: '#dc2626' }}>{stats.last24h}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#454652' }}>{t('error.last_24h', lang)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(26,35,126,0.03)] text-center">
            <p className="text-2xl font-headline font-extrabold" style={{ color: '#dc2626' }}>{stats.errors}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#454652' }}>{t('error.errors', lang)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(26,35,126,0.03)] text-center">
            <p className="text-2xl font-headline font-extrabold" style={{ color: '#7c3aed' }}>{stats.fatal}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#454652' }}>{t('error.fatal', lang)}</p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-4 mb-6">
        {['', 'error', 'warn', 'fatal'].map((level) => (
          <button key={level} onClick={() => { setFilter(level); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === level ? 'text-white' : ''}`}
            style={filter === level ? { background: 'linear-gradient(135deg, #000666, #1a237e)' } : { background: '#f3f3f3', color: '#454652' }}>
            {level || t('common.all', lang)}
          </button>
        ))}
      </div>

      {/* Log list */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
        <div className="divide-y" style={{ borderColor: 'rgba(198,197,212,0.1)' }}>
          {logs.map((log: any) => (
            <div key={log.id} className="px-8 py-5 hover:opacity-80 transition-opacity">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: LEVEL_BG[log.level] || LEVEL_BG.info }}>
                    {log.level === 'fatal' ? <AlertTriangle size={16} style={{ color: LEVEL_COLORS[log.level] }} /> :
                     log.level === 'error' ? <Bug size={16} style={{ color: LEVEL_COLORS[log.level] }} /> :
                     <Server size={16} style={{ color: LEVEL_COLORS[log.level] }} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ background: LEVEL_BG[log.level] || LEVEL_BG.info, color: LEVEL_COLORS[log.level] || LEVEL_COLORS.info }}>
                      {log.level}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{log.source}</span>
                    {log.statusCode && (
                      <span className="text-[10px] font-bold" style={{ color: log.statusCode >= 500 ? '#dc2626' : '#9f4200' }}>{log.statusCode}</span>
                    )}
                    {log.method && <span className="text-[10px] font-mono" style={{ color: '#767683' }}>{log.method}</span>}
                    <span className="text-[10px] ml-auto flex-shrink-0" style={{ color: '#767683' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1" style={{ color: '#1a1c1c' }}>{log.message}</p>
                  {log.path && <p className="text-xs mt-0.5 font-mono" style={{ color: '#767683' }}>{log.path}</p>}
                  {log.stack && (
                    <details className="mt-2">
                      <summary className="text-[10px] font-bold cursor-pointer hover:opacity-70" style={{ color: '#767683' }}>{t('error.stack_trace', lang)}</summary>
                      <pre className="mt-2 text-[10px] font-mono p-3 rounded-xl overflow-x-auto whitespace-pre-wrap" style={{ background: '#f9f9f9', color: '#767683', maxHeight: '200px' }}>{log.stack}</pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="px-8 py-16 text-center text-sm" style={{ color: '#454652' }}>{t('error.no_logs', lang)}</div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 flex items-center justify-between border-t" style={{ background: 'rgba(238,238,238,0.3)', borderColor: 'rgba(198,197,212,0.1)' }}>
          <p className="text-xs" style={{ color: '#454652' }}>{t('common.page', lang)} {page} {t('common.of', lang)} {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-white shadow-sm hover:bg-[#000666] hover:text-white transition-all disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-white shadow-sm hover:bg-[#000666] hover:text-white transition-all disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
