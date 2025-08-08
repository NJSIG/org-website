import { Access } from 'payload';

// Allow access to editors or more privileged users OR when the collection item is published
// This can be used to allow privileged users to view content that is not yet publicly available

export const editorOrPublished: Access = ({ req: { user } }) => {
  // Scenario 1: User is logged in & has a role of 'editor'
  if (user && user.role === 'editor') {
    return true;
  }

  // Scenario 2: User is logged in & has a role of 'admin'
  if (user && user.role === 'admin') {
    return true;
  }

  // Scenario 3: Content is published
  return {
    _status: {
      equals: 'published',
    },
  };
};
