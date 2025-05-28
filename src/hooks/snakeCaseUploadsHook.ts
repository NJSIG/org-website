import { BeforeOperationHook } from 'node_modules/payload/dist/collections/config/types';

export const snakeCaseUploadsHook: BeforeOperationHook = ({ req, operation }) => {
  if ((operation === 'create' || operation === 'update') && req.file) {
    const { name } = req.file;
    const lastDotIndex = name.lastIndexOf('.');

    let baseName = name;
    let extension = '';

    if (lastDotIndex !== -1) {
      baseName = name.slice(0, lastDotIndex);
      extension = name.slice(lastDotIndex); // includes the dot
    }

    const snakeCaseName = baseName
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s\-\.]+/g, '_')
      .toLowerCase();

    req.file.name = snakeCaseName + extension;
  }
};
