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
};

export type LinkDestinations = 'reference' | 'custom';
export type LinkDestinationOptions = Record<LinkDestinations, Options>;

// Helper type for options
type Options = { label: string; value: string };

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

type AllowedStyleVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
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

type AllowedColorVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
    ? T[number] extends infer A
      ? A extends LinkAppearances
        ? AppearanceColorMap[A]
        : never
      : never
    : ColorVariants;

// Size Variants
export type SizeVariants = 'small' | 'medium';
export type SizeVariantOptions = Record<SizeVariants, Options>;

type AppearanceSizeMap = {
  button: SizeVariants;
  cta: SizeVariants;
  icon: SizeVariants;
};

type AllowedSizeVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
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

type AllowedIconsPositionVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
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
