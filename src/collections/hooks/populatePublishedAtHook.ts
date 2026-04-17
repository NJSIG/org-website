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
    if (
      data._status === 'published' &&
      originalDoc?._status !== 'published' &&
      !originalDoc?.publishedAt
    ) {
      return {
        ...data,
        publishedAt: now,
      };
    }

    // Set to null when becoming unpublished
    // This block seems to be clearing the publishedAt date when a new draft is created from a published document, this is not desired.
    // We want to maintain the original publishedAt date even if the document changes.
    // if (data._status !== 'published') {
    //   return {
    //     ...data,
    //     publishedAt: null,
    //   };
    // }
  }

  return data;
};
