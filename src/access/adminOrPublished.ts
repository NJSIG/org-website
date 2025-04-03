import { Access } from 'payload';

// Allow access to admin users or published content
// This is useful for collections or global settings that should be accessible to admin users
// or for content that is publicly available when published

// TODO: Add check for user role
export const adminOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true;
  }

  return {
    _status: {
      equals: 'published',
    },
  };
};
