import { Minimatch } from 'minimatch';
import { APIError, CollectionBeforeChangeHook } from 'payload';

export const checkSquareHook: CollectionBeforeChangeHook = async ({ data, req }) => {
  const mimeTypeMatcher = new Minimatch('image/*');

  if (!mimeTypeMatcher.match(data.mimeType)) {
    return data;
  }

  const file = req.file;

  if (file === null || file === undefined || !('data' in file)) {
    return data;
  }

  const fileData = file.data;

  if (!Buffer.isBuffer(fileData)) {
    return data;
  }

  const dimensions = await getImageDimensions(fileData);

  if (dimensions.width !== dimensions.height) {
    throw new APIError('Image must be square (width and height must be equal).', 400);
  }

  return data;
};

async function getImageDimensions(fileData: Buffer): Promise<{ width: number; height: number }> {
  const { default: sharp } = await import('sharp');
  const metadata = await sharp(fileData).metadata();

  if (!metadata.width || !metadata.height) {
    throw new APIError('Unable to determine image dimensions.', 400);
  }

  return { width: metadata.width, height: metadata.height };
}
