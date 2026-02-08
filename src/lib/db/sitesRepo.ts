import { db, type SiteRow } from './appDb';

export async function upsertSiteLocal(row: Omit<SiteRow, 'deleted'>) {
  const full: SiteRow = { ...row, deleted: false };

  await db.transaction('rw', db.sites, db.outbox, async () => {
    await db.sites.put(full);
    await db.outbox.add({
      entity: 'sites',
      op: 'upsert',
      rowId: full.id,
      payload: full,
      createdAt: new Date().toISOString(),
      attempts: 0
    });
  });
}

export async function deleteSiteLocal(id: string) {
  const existing = await db.sites.get(id);
  if (!existing) return;

  const updated: SiteRow = { ...existing, deleted: true, updatedAt: new Date().toISOString() };

  await db.transaction('rw', db.sites, db.outbox, async () => {
    await db.sites.put(updated);
    await db.outbox.add({
      entity: 'sites',
      op: 'delete',
      rowId: id,
      payload: { id, updatedAt: updated.updatedAt },
      createdAt: new Date().toISOString(),
      attempts: 0
    });
  });
}
