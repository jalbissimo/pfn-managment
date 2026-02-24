import { db } from '@/lib/db/appDb';
import { SiteRow } from '@lib/db/db.types';

const META_KEY = 'sites:lastPulledAt';

export async function pushSitesOutbox() {
  const items = await db.outbox.where('entity').equals('sites').sortBy('id');

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
          deleted: !!local.deleted
        })
      });

      if (!res.ok) throw new Error('push failed');

      const json = await res.json();
      const server = json.data;

      const merged = {
        id: server.id,
        name: server.name,
        address: server.address.toString(),
        updatedAt: server.updated_at.toString(),
        deleted: server.deleted ? 1 : 0
      };

      await db.transaction('rw', db.sites, db.outbox, async () => {
        await db.sites.put(merged as SiteRow);
        await db.outbox.delete(item.id!);
      });
    } catch {
      await db.outbox.update(item.id!, { attempts: item.attempts + 1 });
      break;
    }
  }
}

export async function pullSitesToLocal() {
  const meta = await db.meta.get(META_KEY);
  const since = meta?.value;

  const pending = await db.outbox.where('entity').equals('sites').toArray();
  const pendingIds = new Set(pending.map((x) => x.rowId));

  const params = new URLSearchParams();
  params.set('includeDeleted', '1');
  if (since) params.set('since', since);

  const res = await fetch(`/api/sites?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) return;

  const json = await res.json();
  const data = (json.data ?? []) as any[];

  const rows = data
    .filter((x) => !pendingIds.has(x.id))
    .map((x) => ({
      id: x.id,
      name: x.name,
      address: x.address,
      updatedAt: x.updated_at,
      deleted: x.deleted ? 1 : 0
    }));

  await db.transaction('rw', db.sites, db.meta, async () => {
    if (rows.length) await db.sites.bulkPut(rows as SiteRow[]);

    const maxUpdatedAt = rows.reduce(
      (max, r) => (r.updatedAt > max ? r.updatedAt : max),
      since ?? '1970-01-01T00:00:00.000Z'
    );

    await db.meta.put({ key: META_KEY, value: maxUpdatedAt });
  });
}

export async function syncSites() {
  if (!navigator.onLine) return;
  await pushSitesOutbox();
  await pullSitesToLocal();
}
