import { db } from '@/lib/db/appDb';
import type { EmployeeRow } from '@/lib/db/db.types';

type ServerEmployee = {
  id: string;
  name: string;
  job_title: string | null;
  hourly_rate: number;
  hours_per_day: number;
  updated_at: string;
  deleted: boolean;
};

const META_KEY = 'employees:lastPulledAt';

export async function pushEmployeesOutbox() {
  const items = await db.outbox.where('entity').equals('employees').sortBy('id');

  for (const item of items) {
    try {
      const local = await db.employees.get(item.rowId);
      if (!local) {
        await db.outbox.delete(item.id!);
        continue;
      }

      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: local.id,
          name: local.name,
          jobTitle: local.jobTitle ?? null,
          hourlyRate: local.hourlyRate,
          hoursPerDay: local.hoursPerDay,
          deleted: !!local.deleted
        })
      });
      if (!res.ok) throw new Error('push failed');

      const json = await res.json();
      const server = json.data as ServerEmployee;

      const merged = {
        id: server.id,
        name: server.name,
        jobTitle: server.job_title,
        hourlyRate: Number(server.hourly_rate ?? 0),
        hoursPerDay: Number(server.hours_per_day ?? 0),
        updatedAt: server.updated_at,
        deleted: server.deleted ? 1 : 0
      };

      await db.transaction('rw', db.employees, db.outbox, async () => {
        await db.employees.put(merged as EmployeeRow);
        await db.outbox.delete(item.id!);
      });
    } catch {
      await db.outbox.update(item.id!, { attempts: item.attempts + 1 });
      break;
    }
  }
}

export async function pullEmployeesToLocal() {
  const meta = await db.meta.get(META_KEY);
  const since = meta?.value;

  const pending = await db.outbox.where('entity').equals('employees').toArray();
  const pendingIds = new Set(pending.map((x) => x.rowId));

  const params = new URLSearchParams();
  params.set('includeDeleted', '1');
  if (since) params.set('since', since);

  const res = await fetch(`/api/employees?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) return;

  const json = await res.json();
  const data = (json.data ?? []) as ServerEmployee[];

  const rows = data
    .filter((x) => !pendingIds.has(x.id))
    .map((x) => ({
      id: x.id,
      name: x.name,
      jobTitle: x.job_title,
      hourlyRate: Number(x.hourly_rate ?? 0),
      hoursPerDay: Number(x.hours_per_day ?? 0),
      updatedAt: x.updated_at,
      deleted: x.deleted ? 1 : 0
    }));

  await db.transaction('rw', db.employees, db.meta, async () => {
    if (rows.length) await db.employees.bulkPut(rows as EmployeeRow[]);

    const maxUpdatedAt = rows.reduce(
      (max, r) => (r.updatedAt > max ? r.updatedAt : max),
      since ?? '1970-01-01T00:00:00.000Z'
    );

    await db.meta.put({ key: META_KEY, value: maxUpdatedAt });
  });
}

export async function syncEmployees() {
  if (!navigator.onLine) return;
  await pushEmployeesOutbox();
  await pullEmployeesToLocal();
}
