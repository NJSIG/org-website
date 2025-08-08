import { CollectionBeforeChangeHook } from 'payload';

export const populateFileTypeHook: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    if (req.file) {
      const { mimetype } = req.file;

      // Extract the file type from the MIME type
      const fileType = mimetype.split('/')[1];

      return {
        ...data,
        fileType,
      };
    }
  }

  return data;
};
