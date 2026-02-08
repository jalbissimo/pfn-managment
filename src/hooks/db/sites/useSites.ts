import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@lib/db/appDb';

export function useSites() {
  const data = useLiveQuery(
    async () => {
      const all = await db.sites.toArray();
      return all.filter((x) => !x.deleted);
    },
    [],
    undefined
  );

  return { data: data ?? [], isLoading: data === undefined };
}
