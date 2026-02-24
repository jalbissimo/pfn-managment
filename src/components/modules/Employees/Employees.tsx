'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import ActionHeader from '@components/core/ActionHeader';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
import { triggerMaterialTableAddRow } from '@components/core/ThorTable';

import { useEmployees } from '@hooks/db/employees/useEmployees';
import type { EmployeeRow } from '@lib/db/db.types';
import { deleteEmployeeLocal, upsertEmployeeLocal } from '@lib/db/employeesRepo';
import { syncEmployees } from '@lib/sync/employeesSync';
import EmployeesTable from '@components/modules/Employees/EmployeesTable';

export default function Employees() {
  const { data: employees = [], isLoading } = useEmployees() ?? {};
  const tableRef = useRef<any>(null);

  useEffect(() => {
    syncEmployees().catch(() => {});
    const onOnline = () => syncEmployees().catch(() => {});
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  const handleSync = useCallback(() => {
    syncEmployees().catch(() => {});
  }, []);

  const editable = useMemo(() => {
    return {
      onRowAdd: async (newData: Partial<EmployeeRow>) => {
        const id = crypto.randomUUID();
        await upsertEmployeeLocal({
          id,
          name: (newData.name ?? '').trim(),
          jobTitle: (newData.jobTitle ?? '').toString().trim() || null,
          hourlyRate: Number(newData.hourlyRate ?? 0),
          hoursPerDay: Number(newData.hoursPerDay ?? 8),
          updatedAt: new Date().toISOString()
        } as EmployeeRow);
        await syncEmployees().catch(() => {});
      },
      onRowUpdate: async (newData: Partial<EmployeeRow>, oldData?: EmployeeRow) => {
        if (!oldData?.id) throw new Error('Missing row id');

        await upsertEmployeeLocal({
          id: oldData.id,
          name: (newData.name ?? '').trim(),
          jobTitle: (newData.jobTitle ?? '').toString().trim() || null,
          hourlyRate: Number(newData.hourlyRate ?? 0),
          hoursPerDay: Number(newData.hoursPerDay ?? 8),
          updatedAt: new Date().toISOString()
        } as EmployeeRow);
        await syncEmployees().catch(() => {});
      },
      onRowDelete: async (oldData: EmployeeRow) => {
        await deleteEmployeeLocal(oldData.id);
        await syncEmployees().catch(() => {});
      }
    };
  }, []);

  const headerActions = [
    {
      title: 'Adaugă Angajat',
      onClick: () => triggerMaterialTableAddRow(tableRef),
      startIcon: <AddIcon />,
      variant: 'outlined'
    },
    {
      title: 'Sincronizează Acum',
      onClick: handleSync,
      startIcon: <SyncIcon />,
      variant: 'contained'
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <ActionHeader title="Angajați" actions={headerActions} />
      <EmployeesTable
        employees={employees}
        editable={editable as any}
        isLoading={isLoading}
        tableRef={tableRef}
      />
    </Box>
  );
}
