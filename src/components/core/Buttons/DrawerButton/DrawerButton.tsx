import React from 'react';
import Menu from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

export default function DrawerButton({ onClick }: { onClick: any }) {
  return (
    <IconButton color="secondary" sx={{ ml: 2, mr: 2 }} onClick={onClick} id="menu-button">
      <Menu />
    </IconButton>
  );
};
