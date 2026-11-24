'use client';

import { authClient } from '@/lib/authClient';
import { SIGN_IN_URL } from '@/lib/authPaths';
import { LogOutIcon } from '@payloadcms/ui';

export const LogoutButton: React.FC = () => {
  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    authClient.signOut({
      fetchOptions: {
        // Hard navigation also resets Payload's client-side auth state.
        onSuccess: () => {
          window.location.href = SIGN_IN_URL; // Use '/' for the site homepage
        },
      },
    });
  };

  return (
    <button className="nav__log-out" tabIndex={0} title="Log Out" onClick={handleLogout}>
      <LogOutIcon></LogOutIcon>
    </button>
  );
};
