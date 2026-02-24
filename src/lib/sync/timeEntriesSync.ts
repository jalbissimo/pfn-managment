import { db } from '@/lib/db/appDb';
import type { TimeEntryRow } from '@/lib/db/db.types';

type ServerTimeEntry = {
  id: string;
  employee_id: string;
  site_id: string | null;
  work_date: string;
  hours: number;
  note: string | null;
  updated_at: string;
  deleted: boolean;
};

const META_KEY = 'timeEntries:lastPulledAt';

const compositeKey = (employeeId: string, workDate: string) => `${employeeId}|${workDate}`;

export async function pushTimeEntriesOutbox() {
  const items = await db.outbox.where('entity').equals('timeEntries').sortBy('id');

  for (const item of items) {
    try {
      const local = await db.timeEntries.get(item.rowId);

      if (!local) {
        await db.outbox.delete(item.id!);
        continue;
      }

      const siteId = String((local.siteId ?? '') as any).trim() || null;

      if (!local.employeeId || !local.workDate) {
        console.warn('Dropping corrupted local time entry', local, item);
        await db.outbox.delete(item.id!);
        continue;
      }

      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: local.id,
          employeeId: local.employeeId,
          siteId,
          workDate: local.workDate,
          hours: Number(local.hours ?? 0),
          note: local.note ?? null,
          deleted: !!local.deleted
        })
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 400) {
          console.warn('Dropping outbox item (400):', json, item);
          await db.outbox.delete(item.id!);
          continue;
        }
        throw new Error(json?.error ?? 'push failed');
      }

      const server = json.data as ServerTimeEntry;

      const merged = {
        id: server.id,
        employeeId: server.employee_id,
        siteId: server.site_id,
        workDate: server.work_date,
        hours: Number(server.hours ?? 0),
        note: server.note ?? null,
        updatedAt: server.updated_at,
        deleted: server.deleted ? 1 : 0
      };

      await db.transaction('rw', db.timeEntries, db.outbox, async () => {
        if (server.id !== local.id) {
          await db.timeEntries.delete(local.id);
        }
        await db.timeEntries.put(merged as TimeEntryRow);
        await db.outbox.delete(item.id!);
      });
    } catch (e) {
      await db.outbox.update(item.id!, { attempts: item.attempts + 1 });
      break;
    }
  }
}

export async function pullTimeEntriesToLocal() {
  const meta = await db.meta.get(META_KEY);
  const since = meta?.value;

  const pending = await db.outbox.where('entity').equals('timeEntries').toArray();
  const pendingIds = new Set(pending.map((x) => x.rowId));

  const pendingComposites = new Set<string>();
  for (const p of pending) {
    const r = await db.timeEntries.get(p.rowId);
    if (r?.employeeId && r?.workDate) pendingComposites.add(compositeKey(r.employeeId, r.workDate));
  }

  const params = new URLSearchParams();
  params.set('includeDeleted', '1');
  if (since) params.set('since', since);

  const res = await fetch(`/api/time-entries?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) return;

  const json = await res.json();
  const data = (json.data ?? []) as ServerTimeEntry[];

  const rows = data
    .filter((x) => !pendingIds.has(x.id))
    .filter((x) => !pendingComposites.has(compositeKey(x.employee_id, x.work_date)))
    .map((x) => ({
      id: x.id,
      employeeId: x.employee_id,
      siteId: x.site_id,
      workDate: x.work_date,
      hours: Number(x.hours ?? 0),
      note: x.note ?? null,
      updatedAt: x.updated_at,
      deleted: x.deleted ? 1 : 0
    }));

  await db.transaction('rw', db.timeEntries, db.meta, async () => {
    if (rows.length) await db.timeEntries.bulkPut(rows as TimeEntryRow[]);

    const maxUpdatedAt = rows.reduce(
      (max, r) => (r.updatedAt > max ? r.updatedAt : max),
      since ?? '1970-01-01T00:00:00.000Z'
    );

    await db.meta.put({ key: META_KEY, value: maxUpdatedAt });
  });
}

export async function syncTimeEntries() {
  if (!navigator.onLine) return;
  await pushTimeEntriesOutbox();
  await pullTimeEntriesToLocal();
}
