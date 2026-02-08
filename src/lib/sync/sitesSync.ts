import { db, type SiteRow } from '@/lib/db/appDb';

export async function pushSitesOutbox() {
  const items = await db.outbox.where('entity').equals('sites').toArray();

  for (const item of items) {
    try {
      const local = await db.sites.get(item.rowId);

      if (!local) {
        await db.outbox.delete(item.id!);
        continue;
      }

      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: local.id,
          name: local.name,
          address: local.address ?? null,
          updatedAt: local.updatedAt,
          deleted: local.deleted
        })
      });

      if (!res.ok) throw new Error('push failed');

      await db.outbox.delete(item.id!);
    } catch {
      await db.outbox.update(item.id!, { attempts: item.attempts + 1 });
      break;
    }
  }
}

export async function pullSitesToLocal() {
  const res = await fetch('/api/sites', { credentials: 'include' });
  if (!res.ok) return;

  const json = await res.json();
  const data = (json.data ?? []) as any[];

  const rows: SiteRow[] = data.map((x) => ({
    id: x.id,
    name: x.name,
    address: x.address,
    updatedAt: x.updated_at,
    deleted: x.deleted
  }));

  await db.sites.bulkPut(rows);
}

export async function syncSites() {
  if (!navigator.onLine) return;
  await pushSitesOutbox();
  await pullSitesToLocal();
}
