import { User } from '@/payload-types';
import { AccessArgs } from 'payload';

type isAdmin = (args: AccessArgs<User>) => boolean;

// Allow access to admin users only
// This is useful for collections or global settings that should only be accessible to admin users

export const admin: isAdmin = ({ req: { user } }) => {
  if (user && user.role === 'admin') {
    return true;
  }

  // If the user is not an admin, deny access
  return false;
};
