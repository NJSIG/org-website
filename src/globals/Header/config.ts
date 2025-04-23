import { anyone } from '@/access';
import { GlobalConfig } from 'payload';
import { revalidateHeaderHook } from './hooks/revalidateHeaderHook';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone, // Allow anyone to read the header
  },
  fields: [
    // TODO: Add fields for navigation and cta buttons
  ],
  hooks: {
    afterChange: [revalidateHeaderHook],
  },
};
