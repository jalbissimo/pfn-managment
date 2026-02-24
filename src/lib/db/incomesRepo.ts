import { db } from './appDb';
import type { IncomeRow } from './db.types';

export async function upsertIncomeLocal(row: Omit<IncomeRow, 'deleted'>) {
  const full: IncomeRow = { ...row, deleted: 0 };

  await db.transaction('rw', db.incomes, db.outbox, async () => {
    await db.incomes.put(full);

    const key = `incomes:${full.id}`;
    const existing = await db.outbox.where('key').equals(key).first();

    if (existing) {
      await db.outbox.update(existing.id!, {
        op: 'upsert',
        payload: full,
        createdAt: new Date().toISOString()
      });
    } else {
      await db.outbox.add({
        key,
        entity: 'incomes',
        op: 'upsert',
        rowId: full.id,
        payload: full,
        createdAt: new Date().toISOString(),
        attempts: 0
      });
    }
  });
}

export async function deleteIncomeLocal(id: string) {
  const existing = await db.incomes.get(id);
  if (!existing) return;

  const updated: IncomeRow = { ...existing, deleted: 1, updatedAt: new Date().toISOString() };

  await db.transaction('rw', db.incomes, db.outbox, async () => {
    await db.incomes.put(updated);

    const key = `incomes:${id}`;
    const existingOutbox = await db.outbox.where('key').equals(key).first();

    const payload = { id, updatedAt: updated.updatedAt };
    if (existingOutbox) {
      await db.outbox.update(existingOutbox.id!, {
        op: 'delete',
        payload,
        createdAt: new Date().toISOString()
      });
    } else {
      await db.outbox.add({
        key,
        entity: 'incomes',
        op: 'delete',
        rowId: id,
        payload,
        createdAt: new Date().toISOString(),
        attempts: 0
      });
    }
  });
}
