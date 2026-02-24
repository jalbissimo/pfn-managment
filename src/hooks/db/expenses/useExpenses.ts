'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/appDb';

export function useExpenses() {
  const data = useLiveQuery(() => db.expenses.where('deleted').equals(0).toArray(), []);
  return { data, isLoading: data === undefined };
}
