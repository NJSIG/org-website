import { User } from '@/payload-types';
import { AccessArgs } from 'payload';

type isEditor = (args: AccessArgs<User>) => boolean;

// Allow access to editor (or more privileged) users only
// This is useful for collections or global settings that should only be accessible to editor users

export const editor: isEditor = ({ req: { user } }) => {
  // Scenario 1: User is logged in & has a role of 'editor'
  if (user && user.role === 'editor') {
    return true;
  }

  // Scenario 2: User is logged in & has a role of 'admin'
  if (user && user.role === 'admin') {
    return true;
  }

  // If the user is not an editor, deny access
  return false;
};
