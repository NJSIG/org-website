import { CollectionBeforeChangeHook } from 'payload';

export const populatePublishedAtHook: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  const now = new Date();

  // For collections without _status (no drafts), always set publishedAt on create
  if (operation === 'create' && (typeof data._status === 'undefined' || data._status === 'published')) {
    return {
      ...data,
      publishedAt: now,
    };
  }

  // Only run update logic if _status exists (i.e., collection uses drafts)
  if (operation === 'update' && typeof data._status !== 'undefined') {
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
