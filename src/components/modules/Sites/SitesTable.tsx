'use client';

import React from 'react';
import ThorTable from '@components/core/ThorTable/ThorTable';
import { defaultOptions } from '@components/core/ThorTable';
import { formatDateTime } from '@utils/date';
import { SiteRow } from '@lib/db/appDb';

const columns = [
  { title: 'Nume șantier', field: 'name', sorting: true, align: 'left' },
  { title: 'Adresă șantier', field: 'address', sorting: false, align: 'left' },
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
};

export default function SitesTable({ sites, editable, isLoading }: SitesTableProps) {
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
    />
  );
}
