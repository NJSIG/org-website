import { CollectionBeforeChangeHook } from 'payload';

export const populatePublishedAtHook: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  // Set publishedAt for items created as published or when a collection does not have a draft workflow
  if (
    operation === 'create' &&
    (typeof data._status === 'undefined' || data._status === 'published')
  ) {
    return {
      ...data,
      publishedAt: new Date(),
    };
  }

  // Only run update logic if _status exists (i.e., collection uses drafts)
  if (operation === 'update' && typeof data._status !== 'undefined') {
    const now = new Date();

    // Set publishedAt when transitioning to published status
    if (data._status === 'published' && originalDoc?._status !== 'published') {
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
