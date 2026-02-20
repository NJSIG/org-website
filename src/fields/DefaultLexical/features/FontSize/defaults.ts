import { cssVariables } from '@/css-variables';
import { FontSize, FontSizes } from './types';

export const DEFAULT_SIZES: FontSizes = Object.keys(cssVariables.prose) as FontSizes;
export const DEFAULT_SIZE: FontSize = 'lg';
