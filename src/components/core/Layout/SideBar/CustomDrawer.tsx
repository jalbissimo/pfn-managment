import MuiDrawer from '@mui/material/Drawer';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import React, { ReactNode } from 'react';
import DrawerGap from './DrawerGap';

const DRAWER_WIDTH = '224px';

type SideBarProps = {
  open: boolean;
  children: ReactNode;
};

const openedDrawer = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  })
});

const closedDrawer = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({
  theme,
  open
}) => {
  const openedDrawerStyles = {
    ...openedDrawer(theme),
    '& .MuiDrawer-paper': openedDrawer(theme)
  };

  const closedDrawerStyles = {
    ...closedDrawer(theme),
    '& .MuiDrawer-paper': closedDrawer(theme)
  };

  return {
    flexShrink: 0,
    whiteSpace: 'nowrap',
    ...(open ? openedDrawerStyles : closedDrawerStyles)
  };
});

export default function CustomDrawer({ open, children }: SideBarProps) {
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerGap />
      {children}
    </Drawer>
  );
}
