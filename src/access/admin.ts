import { User } from '@/payload-types';
import { AccessArgs } from 'payload';

type isAdmin = (args: AccessArgs<User>) => boolean;

// Allow access to admin users only
// This is useful for collections or global settings that should only be accessible to admin users

// TODO: Add check for user role
export const admin: isAdmin = ({ req: { user } }) => {
  return Boolean(user);
};
