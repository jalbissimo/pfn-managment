import { db } from './appDb';
import type { ExpenseRow } from './db.types';

export async function upsertExpenseLocal(row: Omit<ExpenseRow, 'deleted'>) {
  const full: ExpenseRow = { ...row, deleted: 0 };

  await db.transaction('rw', db.expenses, db.outbox, async () => {
    await db.expenses.put(full);

    const key = `expenses:${full.id}`;
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
        entity: 'expenses',
        op: 'upsert',
        rowId: full.id,
        payload: full,
        createdAt: new Date().toISOString(),
        attempts: 0
      });
    }
  });
}

export async function deleteExpenseLocal(id: string) {
  const existing = await db.expenses.get(id);
  if (!existing) return;

  const updated: ExpenseRow = { ...existing, deleted: 1, updatedAt: new Date().toISOString() };

  await db.transaction('rw', db.expenses, db.outbox, async () => {
    await db.expenses.put(updated);

    const key = `expenses:${id}`;
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
        entity: 'expenses',
        op: 'delete',
        rowId: id,
        payload,
        createdAt: new Date().toISOString(),
        attempts: 0
      });
    }
  });
}
