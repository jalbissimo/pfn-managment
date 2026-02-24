import { db } from './appDb';
import type { EmployeeRow } from './db.types';

export async function upsertEmployeeLocal(row: Omit<EmployeeRow, 'deleted'>) {
  const full: EmployeeRow = { ...row, deleted: 0 };

  await db.transaction('rw', db.employees, db.outbox, async () => {
    await db.employees.put(full);

    const key = `employees:${full.id}`;
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
        entity: 'employees',
        op: 'upsert',
        rowId: full.id,
        payload: full,
        createdAt: new Date().toISOString(),
        attempts: 0
      });
    }
  });
}

export async function deleteEmployeeLocal(id: string) {
  const existing = await db.employees.get(id);
  if (!existing) return;

  const updated: EmployeeRow = { ...existing, deleted: 1, updatedAt: new Date().toISOString() };

  await db.transaction('rw', db.employees, db.outbox, async () => {
    await db.employees.put(updated);

    const key = `employees:${id}`;
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
        entity: 'employees',
        op: 'delete',
        rowId: id,
        payload,
        createdAt: new Date().toISOString(),
        attempts: 0
      });
    }
  });
}
