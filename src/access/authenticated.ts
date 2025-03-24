import { User } from '@/payload-types';
import { AccessArgs } from 'payload';

type isAuthenticated = (args: AccessArgs<User>) => boolean;

// Allow access to authenticated users only
// This is useful for collections or global settings that should only be accessible to logged-in users
export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user);
};
