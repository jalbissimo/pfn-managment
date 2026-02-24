import Dexie, { type Table } from 'dexie';
import type {
  EmployeeRow,
  ExpenseRow,
  IncomeRow,
  MetaRow,
  OutboxRow,
  SiteRow,
  TimeEntryRow
} from './db.types';

class AppDb extends Dexie {
  sites!: Table<SiteRow, string>;
  employees!: Table<EmployeeRow, string>;
  timeEntries!: Table<TimeEntryRow, string>;
  incomes!: Table<IncomeRow, string>;
  expenses!: Table<ExpenseRow, string>;

  outbox!: Table<OutboxRow, number>;
  meta!: Table<MetaRow, string>;

  constructor() {
    super('management-firma-db');

    this.version(1).stores({
      sites: 'id, updatedAt, deleted',
      outbox: '++id, entity, createdAt'
    });

    this.version(2).stores({
      sites: 'id, updatedAt, deleted',
      outbox: '++id, &key, entity, createdAt, rowId',
      meta: '&key'
    });

    this.version(3).stores({
      sites: 'id, updatedAt, deleted',

      employees: 'id, updatedAt, deleted',
      timeEntries: 'id, employeeId, siteId, workDate, updatedAt, deleted',
      incomes: 'id, siteId, entryDate, updatedAt, deleted',
      expenses: 'id, siteId, entryDate, isPayroll, updatedAt, deleted',

      outbox: '++id, &key, entity, createdAt, rowId',
      meta: '&key'
    });

    this.version(4).stores({
      timeEntries: 'id, [employeeId+workDate], employeeId, siteId, workDate, updatedAt, deleted',
      outbox: '++id, &key, entity, createdAt, rowId',
      meta: '&key'
    });
  }
}

export const db = new AppDb();
