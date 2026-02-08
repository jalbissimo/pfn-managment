import List from '@mui/material/List';
import CustomDrawer from '@components/core/Layout/SideBar/CustomDrawer';
import LinkItem from '@components/core/Layout/SideBar/LinkItem';
import { NAV_ITEMS } from '@components/core/Layout/SideBar/nav';
import CollapsibleMenuItem from '@components/core/Layout/SideBar/CollapsibleMenuItem';

const paddingTop = { pt: 0 };

export default function SideBar({ open }: { open: boolean }) {
  return (
    <CustomDrawer open={open}>
      <List sx={paddingTop}>
        <List sx={paddingTop}>
          <>
            {NAV_ITEMS.map((item) =>
              item.children?.length ? (
                <CollapsibleMenuItem key={item.id} item={item} />
              ) : (
                <LinkItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  href={item.href!}
                  icon={item.icon}
                />
              )
            )}
          </>
        </List>
      </List>
    </CustomDrawer>
  );
}
