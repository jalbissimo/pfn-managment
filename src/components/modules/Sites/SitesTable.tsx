'use client';

import React from 'react';
import ThorTable from '@components/core/ThorTable/ThorTable';
import { defaultOptions, required } from '@components/core/ThorTable';
import { formatDateTime } from '@utils/date';
import { SiteRow } from '@lib/db/db.types';

const columns = [
  {
    title: 'Nume șantier',
    field: 'name',
    sorting: true,
    align: 'left',
    validate: (dataRow: any) => required(dataRow.name) || true
  },
  {
    title: 'Adresă șantier',
    field: 'address',
    sorting: false,
    align: 'left',
    validate: (dataRow: any) => required(dataRow.address) || true
  },
  {
    title: 'Ultima actualizare',
    field: 'updatedAt',
    editable: false,
    align: 'center',
    render: (dataRow: any) => formatDateTime(dataRow.updatedAt)
  }
];

type SitesTableProps = {
  sites: SiteRow[] | undefined;
  editable?: {
    onRowAdd?: (newData: Partial<SiteRow>) => Promise<void>;
    onRowUpdate?: (newData: Partial<SiteRow>, oldData?: SiteRow) => Promise<void>;
    onRowDelete?: (oldData: SiteRow) => Promise<void>;
  };
  isLoading: boolean;
  tableRef: any;
};

export default function SitesTable({ sites, editable, isLoading, tableRef }: SitesTableProps) {
  const customOptions = {
    ...defaultOptions,
    toolbar: false
  };

  return (
    <ThorTable
      columns={columns as any}
      data={sites}
      options={customOptions}
      editable={editable as any}
      isLoading={isLoading}
      tableRef={tableRef}
    />
  );
}
