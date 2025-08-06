import { CollectionBeforeChangeHook } from 'payload';

export const populateTitleFromFileHook: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    if (req.data && !req.data.title && req.file) {
      const { name } = req.file;
      const lastDotIndex = name.lastIndexOf('.');

      let baseName = name;

      if (lastDotIndex !== -1) {
        baseName = name.slice(0, lastDotIndex);
      }

      // Convert to title case: replace underscores and hyphens with spaces, capitalize each word
      const title = baseName
        .replace(/[_-]/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
        .join(' ');

      return {
        ...data,
        title,
      };
    }
  }

  return data;
};
