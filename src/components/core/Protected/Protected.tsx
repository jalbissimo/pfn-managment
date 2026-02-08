import React from 'react';
import { useSession } from 'next-auth/react';

type ProtectedProps = {
  children: React.ReactNode;
  permission: string;
};

/**
 * This component is used to protect components based on permission.
 * If user doesn't have such permission `props.permission`- component will not be displayed.
 */
export default function Protected({ children, permission }: ProtectedProps) {
  const { data: session }: any = useSession();
  const visible = permission === 'NO_PROTECTION' || session.permissions.includes(permission);

  return <>{visible && children}</>;
}
