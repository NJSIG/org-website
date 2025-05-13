import { IconNames } from '@/fields/lucideIconPicker/types';
import { Page } from '@/payload-types';
import { Field, GroupField } from 'payload';

export type LinkField = {
  type?: 'reference' | 'custom' | null | undefined;
  newTab?: boolean | null | undefined;
  allowReferrer?: boolean | null | undefined;
  reference?:
    | {
        relationTo: 'pages'; // Add other collections here
        value: string | Page;
      }
    | null
    | undefined;
  url?: string | null | undefined;
  label?: string | null | undefined;
  appearance?: LinkAppearances | false | null | undefined;
  styleVariant?: StyleVariants | false | undefined;
  colorVariant?: ColorVariants | false | undefined;
  sizeVariant?: SizeVariants | false | undefined;
  iconPosition?: IconPositionVariants | false | undefined;
  icon?: IconNames | string | null | undefined;
};

// Helper type for options
type Options = { label: string; value: string };

// Link Destinations
export type LinkDestinations = 'reference' | 'custom';
export type LinkDestinationOptions = Record<LinkDestinations, Options>;

// Link Appearances
export type LinkAppearances = 'button' | 'cta' | 'icon';
export type LinkAppearanceOptions = Record<LinkAppearances, Options>;

// Style Variants
export type StyleVariants = 'flat' | 'outline' | 'ghost';
export type StyleVariantOptions = Record<StyleVariants, Options>;

type AppearanceStyleMap = {
  button: StyleVariants;
  cta: Extract<StyleVariants, 'flat' | 'outline'>;
  icon: never;
};

export type AllowedStyleVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
    ? T[number] extends infer A
      ? A extends LinkAppearances
        ? AppearanceStyleMap[A]
        : never
      : never
    : StyleVariants;

// Color Variants
export type ColorVariants = 'default' | 'primary' | 'accent';
export type ColorVariantOptions = Record<ColorVariants, Options>;

type AppearanceColorMap = {
  button: Extract<ColorVariants, 'primary' | 'accent'>;
  cta: Extract<ColorVariants, 'primary' | 'accent'>;
  icon: Extract<ColorVariants, 'default'>;
};

export type AllowedColorVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
    ? T[number] extends infer A
      ? A extends LinkAppearances
        ? AppearanceColorMap[A]
        : never
      : never
    : ColorVariants;

// Size Variants
export type SizeVariants = 'small' | 'medium' | 'large';
export type SizeVariantOptions = Record<SizeVariants, Options>;

type AppearanceSizeMap = {
  button: Extract<SizeVariants, 'small' | 'medium'>;
  cta: Extract<SizeVariants, 'medium' | 'large'>;
  icon: Extract<SizeVariants, 'small' | 'medium'>;
};

export type AllowedSizeVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
    ? T[number] extends infer A
      ? A extends LinkAppearances
        ? AppearanceSizeMap[A]
        : never
      : never
    : SizeVariants;

// Icon Position Variants
export type IconPositionVariants = 'none' | 'before' | 'after';
export type IconPositionVariantOptions = Record<IconPositionVariants, Options>;

type AppearanceIconsPositionMap = {
  button: IconPositionVariants;
  cta: IconPositionVariants;
  icon: never;
};

export type AllowedIconsPositionVariantsForAppearances<
  T extends LinkAppearances[] | false | undefined,
> = T extends LinkAppearances[]
  ? T[number] extends infer A
    ? A extends LinkAppearances
      ? AppearanceIconsPositionMap[A]
      : never
    : never
  : IconPositionVariants;

// Final Link Type
export type LinkType = <T extends LinkAppearances[] | false | undefined = undefined>(options?: {
  appearances?: T;
  variants?: {
    styles?: AllowedStyleVariantsForAppearances<T>[] | false | undefined;
    colors?: AllowedColorVariantsForAppearances<T>[] | false | undefined;
    sizes?: AllowedSizeVariantsForAppearances<T>[] | false | undefined;
    icons?: AllowedIconsPositionVariantsForAppearances<T>[] | false | undefined;
  };
  destinations?: LinkDestinations[];
  disableNewTab?: boolean;
  disableLabel?: boolean;
  overrides?: Partial<GroupField>;
}) => Field;
