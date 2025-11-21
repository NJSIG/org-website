import { CollectionBeforeChangeHook } from 'payload';

export const populatePublishedAtHook: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  const now = new Date();

  if (operation === 'create' && data._status === 'published') {
    return {
      ...data,
      publishedAt: now,
    };
  }

  if (operation === 'update') {
    // Set publishedAt when transitioning to published status
    if (data._status === 'published' && originalDoc._status !== 'published') {
      return {
        ...data,
        publishedAt: now,
      };
    }

    // Set to null when becoming unpublished
    if (data._status !== 'published') {
      return {
        ...data,
        publishedAt: null,
      };
    }
  }

  return data;
};
