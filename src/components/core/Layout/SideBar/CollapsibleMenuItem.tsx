'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import type { NavItem } from './nav';
import LinkItem from './LinkItem';

const styles = {
  icon: { py: 1, px: 0.5, minWidth: '32px' },
  text: { px: 2 }
};

export default function CollapsibleMenuItem({ item }: { item: NavItem }) {
  const pathname = usePathname();

  const hasActiveChild = useMemo(() => {
    return (item.children ?? []).some((c) => c.href && pathname.startsWith(c.href));
  }, [item.children, pathname]);

  const [open, setOpen] = useState(hasActiveChild);

  return (
    <>
      <ListItemButton onClick={() => setOpen((v) => !v)} id={item.id}>
        <ListItemIcon sx={styles.icon}>{item.icon}</ListItemIcon>
        <ListItemText sx={styles.text} primary={item.text} />
        <>{open ? <ExpandLess /> : <ExpandMore />}</>
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Divider />
        <List disablePadding>
          <>
            {(item.children ?? []).map((child) => (
              <LinkItem
                key={child.id}
                id={child.id}
                text={child.text}
                href={child.href!}
                icon={child.icon}
              />
            ))}
          </>
        </List>
      </Collapse>
    </>
  );
}
