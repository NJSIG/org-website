import { encode } from 'blurhash';
import { Minimatch } from 'minimatch';
import { CollectionBeforeChangeHook } from 'payload';
import sharp from 'sharp';

const imageToBlurhash = async (data: Buffer) => {
  const width = Number(process.env.BLURHASH_SIZE) || 32;
  const height = Number(process.env.BLURHASH_SIZE) || 32;
  const componentX = Number(process.env.BLURHASH_COMPONENT_X) || 4;
  const componentY = Number(process.env.BLURHASH_COMPONENT_Y) || 3;

  const rawPixels = await sharp(data).resize(width, height).ensureAlpha(1).raw().toBuffer();

  return encode(new Uint8ClampedArray(rawPixels), width, height, componentX, componentY);
};

export const computeBlurDataHook: CollectionBeforeChangeHook = async ({ data, req }) => {
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

  const blurhash = await imageToBlurhash(fileData);

  return {
    ...data,
    blurhash,
  };
};
