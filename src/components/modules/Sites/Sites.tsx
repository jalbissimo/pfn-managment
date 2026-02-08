'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import SitesTable from '@components/modules/Sites/SitesTable';
import { useSites } from '@hooks/db/sites/useSites';
import type { SiteRow } from '@lib/db/appDb';

import { deleteSiteLocal, upsertSiteLocal } from '@lib/db/sitesRepo';
import { syncSites } from '@lib/sync/sitesSync';
import ActionHeader from '@components/core/ActionHeader';
import SyncIcon from '@mui/icons-material/Sync';

export default function Sites() {
  const { data: sites, isLoading } = useSites() ?? [];

  useEffect(() => {
    syncSites().catch(() => {});
    const onOnline = () => syncSites().catch(() => {});
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  const handleSync = useCallback(() => {
    syncSites().catch(() => {});
  }, []);

  const editable = useMemo(() => {
    return {
      onRowAdd: async (newData: Partial<SiteRow>) => {
        const id = crypto.randomUUID();

        await upsertSiteLocal({
          id,
          name: (newData.name ?? '').trim(),
          address: (newData.address ?? '').toString().trim() || null,
          updatedAt: new Date().toISOString()
        });

        await syncSites().catch(() => {});
      },

      onRowUpdate: async (newData: Partial<SiteRow>, oldData?: SiteRow) => {
        if (!oldData?.id) throw new Error('Missing row id');

        await upsertSiteLocal({
          id: oldData.id,
          name: (newData.name ?? '').trim(),
          address: (newData.address ?? '').toString().trim() || null,
          updatedAt: new Date().toISOString()
        });

        await syncSites().catch(() => {});
      },

      onRowDelete: async (oldData: SiteRow) => {
        await deleteSiteLocal(oldData.id);
        await syncSites().catch(() => {});
      }
    };
  }, []);

  const headerActions = [
    {
      title: 'Sincronizează Acum',
      onClick: handleSync,
      startIcon: <SyncIcon />,
      variant: 'contained'
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <ActionHeader title="Șantiere" actions={headerActions} />
      <SitesTable sites={sites} editable={editable} isLoading={isLoading} />
    </Box>
  );
}
