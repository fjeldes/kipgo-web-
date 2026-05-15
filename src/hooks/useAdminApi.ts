'use client';
import { useEffect, useState } from 'react';

export function useAdminApi<T = any>(
  fetcher: () => Promise<T>,
  deps: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetcher()
      .then(setData)
      .catch((e: any) => setError(e?.response?.data?.message || e?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load() }, deps);

  return { data, loading, error, refetch: load };
}
