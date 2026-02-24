'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/appDb';

export function useEmployees() {
  const data = useLiveQuery(() => db.employees.where('deleted').equals(0).toArray(), []);
  return { data, isLoading: data === undefined };
}
