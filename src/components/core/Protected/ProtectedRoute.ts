import { getSession } from 'next-auth/react';

/**
 * This component is used to protect pages/routes based on permission.
 * If user doesn't have such 'permission' - page will be redirected to specific path (default is '/').
 * Important! To be used if session exists and redirect should be open route(not need session)
 */
export default async function ProtectedRoute(
  context: any,
  permission: string,
  gsps?: any,
  redirectTo = '/'
) {
  const session: any = await getSession(context);

  if (session.permissions.includes(permission)) {
    return gsps ? gsps(session) : { props: {} };
  }

  return {
    redirect: {
      destination: redirectTo,
      permanent: false
    }
  };
}
