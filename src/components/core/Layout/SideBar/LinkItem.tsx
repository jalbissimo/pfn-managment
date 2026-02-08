import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const classes = {
  icon: {
    paddingY: 1,
    paddingX: 0.5,
    minWidth: 4
  },
  text: {
    paddingX: 2
  }
};

type LinkItemProps = {
  text: string;
  icon: ReactNode;
  href?: string;
  id: string;
};

export default function LinkItem({ text, icon, href, id }: LinkItemProps) {
  const pathname = usePathname();
  return (
    <ListItemButton
      id={id}
      component={Link}
      href={href || ''}
      selected={pathname.includes(href || '')}
    >
      <ListItemIcon sx={classes.icon}>{icon}</ListItemIcon>
      <ListItemText sx={classes.text} primary={text} />
    </ListItemButton>
  );
}
