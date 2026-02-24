'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/appDb';

export function useSites() {
  const data = useLiveQuery(async () => {
    return db.sites.where('deleted').equals(0).toArray();
  }, []);

  return {
    data,
    isLoading: data === undefined
  };
}
