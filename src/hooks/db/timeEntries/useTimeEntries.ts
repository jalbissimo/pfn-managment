'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/appDb';

export function useTimeEntries() {
  const data = useLiveQuery(() => db.timeEntries.where('deleted').equals(0).toArray(), []);
  return { data, isLoading: data === undefined };
}
