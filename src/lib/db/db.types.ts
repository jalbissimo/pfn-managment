export type SyncStatus = 'synced' | 'created' | 'updated' | 'deleted';

export type BaseRow = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted: 0 | 1;
  syncStatus: SyncStatus;
  localUpdatedAt: string;
};

export type SiteRow = BaseRow & {
  name: string;
  address?: string;
};

export type EmployeeRow = BaseRow & {
  name: string;
  jobTitle?: string;
  hourlyRate: number;
  hoursPerDay: number;
};

export type TimeEntryRow = BaseRow & {
  employeeId: string;
  siteId?: string;
  workDate: string;
  hours: number;
  note?: string;
};

export type IncomeRow = BaseRow & {
  siteId?: string;
  description: string;
  amount: number;
  entryDate: string;
};

export type ExpenseRow = BaseRow & {
  siteId?: string;
  description: string;
  amount: number;
  entryDate: string;
  isPayroll: 0 | 1;
  employeeId?: string;
  timeEntryId?: string;
};

export type OutboxEntity = 'sites' | 'employees' | 'timeEntries' | 'incomes' | 'expenses';
export type OutboxOp = 'upsert' | 'delete';

export type OutboxRow = {
  id?: number;
  key: string;
  entity: OutboxEntity;
  op: OutboxOp;
  rowId: string;
  payload: any;
  createdAt: string;
  attempts: number;
};

export type MetaRow = {
  key: string;
  value: string;
};
