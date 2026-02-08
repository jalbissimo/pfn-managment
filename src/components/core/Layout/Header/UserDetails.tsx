'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function UserDetails({ user }: { user: any }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box component="div">
      <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
        <ListItem>
          <ListItemText
            primary={user.name}
            primaryTypographyProps={{ color: 'textPrimary' }}
            secondary={user.email}
            secondaryTypographyProps={{ variant: 'caption', lineHeight: 1.5 }}
            sx={{ margin: '3px' }}
          />
          <ListItemSecondaryAction sx={{ right: 0 }}>
            <IconButton aria-haspopup="true" name="AVATAR" onClick={handleClick}>
              <AccountCircle fontSize="large" color="secondary" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => console.log('logout')} id="sign-out">
          <ListItemIcon>
            <PowerSettingsNew fontSize="small" color="secondary" />
          </ListItemIcon>
          <ListItemText primary={'Sign Out'} />
        </MenuItem>
      </Menu>
    </Box>
  );
}
