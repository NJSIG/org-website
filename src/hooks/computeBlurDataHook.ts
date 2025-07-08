import { decode, encode } from 'blurhash';
import { Minimatch } from 'minimatch';
import { CollectionBeforeChangeHook } from 'payload';
import sharp from 'sharp';

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
  const blurData = await blurhashToBlurData(blurhash);

  return {
    ...data,
    blurData: blurData,
  };
};

const imageToBlurhash = async (data: Buffer) => {
  const size = Number(process.env.BLURHASH_SIZE) || 10;
  const componentX = Number(process.env.BLURHASH_COMPONENT_X) || 4;
  const componentY = Number(process.env.BLURHASH_COMPONENT_Y) || 3;

  const rawPixels = await sharp(data).resize(size, size).ensureAlpha(1).raw().toBuffer();

  return encode(new Uint8ClampedArray(rawPixels), size, size, componentX, componentY);
};

const blurhashToBlurData = async (hash: string): Promise<string> => {
  const size = Number(process.env.BLURHASH_SIZE) || 10;
  const pixels = decode(hash, size, size);
  const buffer = Buffer.from(pixels);

  const webpBuffer = await sharp(buffer, {
    raw: {
      width: size,
      height: size,
      channels: 4,
    },
  })
    .webp({
      quality: 50,
      lossless: false,
    })
    .toBuffer();

  const base64 = webpBuffer.toString('base64');

  return base64;
};
