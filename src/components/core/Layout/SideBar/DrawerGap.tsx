import React from 'react';
import Box from '@mui/material/Box';

export default function DrawerGap() {
  return <Box sx={(theme) => theme.mixins.toolbar} />;
}
