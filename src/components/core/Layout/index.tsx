'use client';

import { ReactNode, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Header from '@components/core/Layout/Header';
import SideBar from '@components/core/Layout/SideBar';
import DrawerGap from '@components/core/Layout/SideBar/DrawerGap';

const classes = {
  layout: { display: 'flex' },
  main: { flexGrow: 1 },
  pageContent: { p: 1 }
};

export default function Layout({ children }: { children: ReactNode }) {
  const [drawer, setDrawer] = useState(true);

  useEffect(() => {
    const drawerState = localStorage.getItem('drawerState');
    if (drawerState) {
      setDrawer(drawerState === 'true');
    }
  }, []);

  const handleDrawer = () => {
    setDrawer(!drawer);
    localStorage.setItem('drawerState', String(!drawer));
  };

  const session = {
    user: {
      name: 'Test User',
      email: 'test@user.com'
    }
  };

  return (
    <Box sx={classes.layout}>
      <Header handleDrawer={handleDrawer} session={session} />
      <SideBar open={drawer} />
      <Box component="main" sx={classes.main}>
        <DrawerGap />

        <Box component="div" sx={classes.pageContent}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
