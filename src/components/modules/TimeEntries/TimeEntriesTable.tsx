'use client';

import React from 'react';
import ThorTable from '@components/core/ThorTable/ThorTable';
import { defaultOptions, required } from '@components/core/ThorTable';
import { formatDateTime } from '@utils/date';
import type { TimeEntryRow } from '@lib/db/db.types';

export default function TimeEntriesTable({
  timeEntries,
  editable,
  isLoading,
  tableRef,
  employeeLookup,
  siteLookup
}: {
  timeEntries: TimeEntryRow[] | undefined;
  editable?: any;
  isLoading: boolean;
  tableRef: any;
  employeeLookup: Record<string, string>;
  siteLookup: Record<string, string>;
}) {
  const columns = [
    {
      title: 'Angajat',
      field: 'employeeId',
      lookup: employeeLookup,
      custom: 'select',
      validate: (r: any) => required(r.employeeId) || true
    },
    {
      title: 'Șantier',
      field: 'siteId',
      custom: 'select',
      lookup: siteLookup,
      validate: (r: any) => required(r.siteId) || true
    },
    {
      title: 'Data',
      field: 'workDate',
      custom: 'date'
    },
    { title: 'Ore', field: 'hours', type: 'numeric' },
    { title: 'Notă', field: 'note' },
    {
      title: 'Ultima actualizare',
      field: 'updatedAt',
      editable: false,
      align: 'center',
      render: (r: any) => formatDateTime(r.updatedAt)
    }
  ];

  return (
    <ThorTable
      columns={columns as any}
      data={timeEntries}
      options={{ ...defaultOptions, toolbar: false }}
      editable={editable}
      isLoading={isLoading}
      tableRef={tableRef}
    />
  );
}
