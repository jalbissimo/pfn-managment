import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/icons-material/Menu';
import HeaderTitle from './HeaderTitle';
import UserDetails from '@components/core/Layout/Header/UserDetails';

type HeaderProps = {
  handleDrawer: any;
  session: any;
};

const DrawerButton = ({ onClick }: { onClick: any }) => {
  return (
    <IconButton color="secondary" sx={{ ml: 2, mr: 2 }} onClick={onClick} id="menu-button">
      <Menu />
    </IconButton>
  );
};

export default function Header({ handleDrawer, session }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: 'whiteSmoke', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <HeaderTitle />
        <DrawerButton onClick={handleDrawer} />
        <Box component="div" sx={{ flexGrow: 1 }} />
        <UserDetails user={session.user} />
      </Toolbar>
    </AppBar>
  );
}
