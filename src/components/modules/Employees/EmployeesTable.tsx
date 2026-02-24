'use client';

import React from 'react';
import ThorTable from '@components/core/ThorTable/ThorTable';
import { defaultOptions, required } from '@components/core/ThorTable';
import { formatDateTime } from '@utils/date';
import type { EmployeeRow } from '@lib/db/db.types';

const columns = [
  { title: 'Nume', field: 'name', sorting: true, validate: (r: any) => required(r.name) || true },
  { title: 'Funcție', field: 'jobTitle', sorting: true },
  { title: 'Tarif/oră', field: 'hourlyRate', type: 'numeric', sorting: true },
  { title: 'Ore/zi', field: 'hoursPerDay', type: 'numeric', sorting: true },
  {
    title: 'Ultima actualizare',
    field: 'updatedAt',
    editable: false,
    align: 'center',
    render: (r: any) => formatDateTime(r.updatedAt)
  }
];

export default function EmployeesTable({
  employees,
  editable,
  isLoading,
  tableRef
}: {
  employees: EmployeeRow[] | undefined;
  editable?: any;
  isLoading: boolean;
  tableRef: any;
}) {
  return (
    <ThorTable
      columns={columns as any}
      data={employees}
      options={{ ...defaultOptions, toolbar: false }}
      editable={editable}
      isLoading={isLoading}
      tableRef={tableRef}
    />
  );
}
