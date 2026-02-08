import Dexie, { type Table } from 'dexie';

export type SiteRow = {
  id: string;
  name: string;
  address?: string | null;
  updatedAt: string;
  deleted: boolean;
};

export type OutboxRow = {
  id?: number;
  entity: 'sites';
  op: 'upsert' | 'delete';
  rowId: string;
  payload: any;
  createdAt: string;
  attempts: number;
};

class AppDb extends Dexie {
  sites!: Table<SiteRow, string>;
  outbox!: Table<OutboxRow, number>;

  constructor() {
    super('management-firma-db');
    this.version(1).stores({
      sites: 'id, updatedAt, deleted',
      outbox: '++id, entity, createdAt'
    });
  }
}

export const db = new AppDb();
