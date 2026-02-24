'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import ActionHeader from '@components/core/ActionHeader';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
import { triggerMaterialTableAddRow } from '@components/core/ThorTable';

import { useTimeEntries } from '@hooks/db/timeEntries/useTimeEntries';
import { useEmployees } from '@hooks/db/employees/useEmployees';
import { useSites } from '@hooks/db/sites/useSites';

import type { TimeEntryRow } from '@lib/db/db.types';
import { deleteTimeEntryLocal, upsertTimeEntryLocal } from '@lib/db/timeEntriesRepo';
import { syncTimeEntries } from '@lib/sync/timeEntriesSync';
import { syncEmployees } from '@lib/sync/employeesSync';
import { syncSites } from '@lib/sync/sitesSync';

import TimeEntriesTable from '@components/modules/TimeEntries/TimeEntriesTable';
import dayjs from 'dayjs';

const toRequiredString = (v: unknown) => String(v ?? '').trim();
const toUuidOrNull = (v: unknown) => {
  const s = String(v ?? '').trim();
  return s.length ? s : null;
};

export default function TimeEntries() {
  const { data: timeEntries = [], isLoading } = useTimeEntries() ?? {};
  const { data: employees = [] } = useEmployees() ?? {};
  const { data: sites = [] } = useSites() ?? {};

  const tableRef = useRef<any>(null);

  useEffect(() => {
    const run = async () => {
      await syncEmployees();
      await syncSites();
      await syncTimeEntries();
    };

    run().catch(console.error);

    const onOnline = () => run().catch(console.error);
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  const handleSync = useCallback(() => {
    (async () => {
      await syncEmployees();
      await syncSites();
      await syncTimeEntries();
    })().catch(console.error);
  }, []);

  const lookups = useMemo(() => {
    const employeeLookup: Record<string, string> = {};
    for (const e of employees) employeeLookup[e.id] = e.name;

    const siteLookup: Record<string, string> = { '': '(fără șantier)' };
    for (const s of sites) siteLookup[s.id] = s.name;

    return { employeeLookup, siteLookup };
  }, [employees, sites]);

  const editable = useMemo(() => {
    return {
      onRowAdd: async (newData: Partial<TimeEntryRow>) => {
        const id = crypto.randomUUID();

        const employeeId = toRequiredString(newData.employeeId);
        if (!employeeId) throw new Error('Selectează un angajat');

        const workDate = toRequiredString(newData.workDate) || dayjs().format('YYYY-MM-DD');

        await upsertTimeEntryLocal({
          id,
          employeeId,
          siteId: toUuidOrNull(newData.siteId),
          workDate,
          hours: Number(newData.hours ?? 0),
          note: toRequiredString(newData.note) || null,
          updatedAt: new Date().toISOString()
        } as TimeEntryRow);

        await syncTimeEntries().catch(console.error);
      },

      onRowUpdate: async (newData: Partial<TimeEntryRow>, oldData?: TimeEntryRow) => {
        if (!oldData?.id) throw new Error('Missing row id');

        const employeeId = toRequiredString(newData.employeeId ?? oldData.employeeId);
        if (!employeeId) throw new Error('Selectează un angajat');

        const workDate =
          toRequiredString(newData.workDate ?? oldData.workDate) || dayjs().format('YYYY-MM-DD');

        await upsertTimeEntryLocal({
          id: oldData.id,
          employeeId,
          siteId: toUuidOrNull(newData.siteId ?? oldData.siteId),
          workDate,
          hours: Number(newData.hours ?? oldData.hours ?? 0),
          note: toRequiredString(newData.note ?? oldData.note) || null,
          updatedAt: new Date().toISOString()
        } as TimeEntryRow);

        await syncTimeEntries().catch(console.error);
      },

      onRowDelete: async (oldData: TimeEntryRow) => {
        await deleteTimeEntryLocal(oldData.id);
        await syncTimeEntries().catch(console.error);
      }
    };
  }, []);

  const headerActions = [
    {
      title: 'Adaugă Pontaj',
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
      <ActionHeader title="Pontaj" actions={headerActions} />
      <TimeEntriesTable
        timeEntries={timeEntries}
        editable={editable as any}
        isLoading={isLoading}
        tableRef={tableRef}
        employeeLookup={lookups.employeeLookup}
        siteLookup={lookups.siteLookup}
      />
    </Box>
  );
}
