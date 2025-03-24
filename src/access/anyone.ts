import { Access } from 'payload';

// Allow access to anyone, including unauthenticated users
// This is useful for public collections or global settings that should be accessible without authentication
export const anyone: Access = () => true;
