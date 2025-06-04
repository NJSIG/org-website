import { GenerateImageName } from 'payload';

type Generators = 'bySize' | 'byWidth' | 'byHeight' | 'byWidthAndHeight';

type ImageNameGenerators = Record<Generators, GenerateImageName>;

export const imageNameGenerators: ImageNameGenerators = {
  bySize: ({ originalName, extension, sizeName }) => {
    return `${originalName}-${sizeName}.${extension}`;
  },
  byWidth: ({ originalName, extension, width }) => {
    return `${originalName}-${width}.${extension}`;
  },
  byHeight: ({ originalName, extension, height }) => {
    return `${originalName}-${height}.${extension}`;
  },
  byWidthAndHeight: ({ originalName, extension, width, height }) => {
    return `${originalName}-${width}x${height}.${extension}`;
  },
};
