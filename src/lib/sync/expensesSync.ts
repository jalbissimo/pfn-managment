import { db } from '@/lib/db/appDb';
import type { ExpenseRow } from '@/lib/db/db.types';

type ServerExpense = {
  id: string;
  site_id: string | null;
  entry_date: string;
  description: string;
  amount: number;
  is_payroll: boolean;
  employee_id: string | null;
  time_entry_id: string | null;
  updated_at: string;
  deleted: boolean;
};

const META_KEY = 'expenses:lastPulledAt';

export async function pushExpensesOutbox() {
  const items = await db.outbox.where('entity').equals('expenses').sortBy('id');

  for (const item of items) {
    try {
      const local = await db.expenses.get(item.rowId);
      if (!local) {
        await db.outbox.delete(item.id!);
        continue;
      }

      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: local.id,
          siteId: local.siteId ?? null,
          entryDate: local.entryDate,
          description: local.description,
          amount: local.amount,
          isPayroll: !!local.isPayroll,
          employeeId: local.employeeId ?? null,
          timeEntryId: local.timeEntryId ?? null,
          deleted: !!local.deleted
        })
      });
      if (!res.ok) throw new Error('push failed');

      const json = await res.json();
      const server = json.data as ServerExpense;

      const merged = {
        id: server.id,
        siteId: server.site_id,
        entryDate: server.entry_date,
        description: server.description,
        amount: Number(server.amount ?? 0),
        isPayroll: server.is_payroll ? 1 : 0,
        employeeId: server.employee_id,
        timeEntryId: server.time_entry_id,
        updatedAt: server.updated_at,
        deleted: server.deleted ? 1 : 0
      };

      await db.transaction('rw', db.expenses, db.outbox, async () => {
        await db.expenses.put(merged as ExpenseRow);
        await db.outbox.delete(item.id!);
      });
    } catch {
      await db.outbox.update(item.id!, { attempts: item.attempts + 1 });
      break;
    }
  }
}

export async function pullExpensesToLocal() {
  const meta = await db.meta.get(META_KEY);
  const since = meta?.value;

  const pending = await db.outbox.where('entity').equals('expenses').toArray();
  const pendingIds = new Set(pending.map((x) => x.rowId));

  const params = new URLSearchParams();
  params.set('includeDeleted', '1');
  if (since) params.set('since', since);

  const res = await fetch(`/api/expenses?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) return;

  const json = await res.json();
  const data = (json.data ?? []) as ServerExpense[];

  const rows = data
    .filter((x) => !pendingIds.has(x.id))
    .map((x) => ({
      id: x.id,
      siteId: x.site_id,
      entryDate: x.entry_date,
      description: x.description,
      amount: Number(x.amount ?? 0),
      isPayroll: x.is_payroll ? 1 : 0,
      employeeId: x.employee_id,
      timeEntryId: x.time_entry_id,
      updatedAt: x.updated_at,
      deleted: x.deleted ? 1 : 0
    }));

  await db.transaction('rw', db.expenses, db.meta, async () => {
    if (rows.length) await db.expenses.bulkPut(rows as ExpenseRow[]);

    const maxUpdatedAt = rows.reduce(
      (max, r) => (r.updatedAt > max ? r.updatedAt : max),
      since ?? '1970-01-01T00:00:00.000Z'
    );

    await db.meta.put({ key: META_KEY, value: maxUpdatedAt });
  });
}

export async function syncExpenses() {
  if (!navigator.onLine) return;
  await pushExpensesOutbox();
  await pullExpensesToLocal();
}
