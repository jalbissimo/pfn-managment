import { db } from './appDb';
import type { TimeEntryRow } from './db.types';

const outboxKey = (id: string) => `timeEntries:${id}`;

export async function upsertTimeEntryLocal(row: Omit<TimeEntryRow, 'deleted'>) {
  // normalize
  const employeeId = String(row.employeeId ?? '').trim();
  const workDate = String(row.workDate ?? '').trim(); // YYYY-MM-DD
  const siteId = String((row.siteId ?? '') as any).trim() || null;

  if (!employeeId || !workDate) {
    throw new Error('Missing employeeId/workDate');
  }

  await db.transaction('rw', db.timeEntries, db.outbox, async () => {
    const existing = await db.timeEntries
      .where('[employeeId+workDate]')
      .equals([employeeId, workDate])
      .first();

    const finalId = existing?.id ?? row.id;

    const full = {
      id: finalId,
      employeeId,
      siteId,
      workDate,
      hours: Number(row.hours ?? 0),
      note: (row.note ?? null) as any,
      updatedAt: row.updatedAt,
      deleted: 0
    };

    await db.timeEntries.put(full as TimeEntryRow);

    const key = outboxKey(finalId);
    const existingOutbox = await db.outbox.where('key').equals(key).first();

    if (existingOutbox) {
      await db.outbox.update(existingOutbox.id!, {
        op: 'upsert',
        payload: full,
        createdAt: new Date().toISOString()
      });
    } else {
      await db.outbox.add({
        key,
        entity: 'timeEntries',
        op: 'upsert',
        rowId: finalId,
        payload: full,
        createdAt: new Date().toISOString(),
        attempts: 0
      });
    }

    if (existing?.id && existing.id !== row.id) {
      await db.timeEntries.delete(row.id);
    }
  });
}

export async function deleteTimeEntryLocal(id: string) {
  const existing = await db.timeEntries.get(id);
  if (!existing) return;

  const updated: TimeEntryRow = {
    ...existing,
    deleted: 1,
    updatedAt: new Date().toISOString()
  };

  await db.transaction('rw', db.timeEntries, db.outbox, async () => {
    await db.timeEntries.put(updated);

    const key = outboxKey(id);
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
        entity: 'timeEntries',
        op: 'delete',
        rowId: id,
        payload,
        createdAt: new Date().toISOString(),
        attempts: 0
      });
    }
  });
}
