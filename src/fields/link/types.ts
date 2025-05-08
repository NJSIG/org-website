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

export type LinkAppearances = 'default' | 'button' | 'cta' | 'icon';
export type LinkAppearanceOptions = Record<LinkAppearances, { label: string; value: string }>;

// Define valid values for each variant type
type StyleVariants = 'flat' | 'outline' | 'ghost';
type ColorVariants = 'default' | 'primary' | 'accent';
type SizeVariants = 'small' | 'medium';
type IconsPositionVariants = 'none' | 'before' | 'after';

// Define a mapping of appearance types to their valid variant properties
type AppearanceStyleMap = {
  default: never;
  button: StyleVariants;
  cta: Extract<StyleVariants, 'flat' | 'outline'>;
  icon: never;
};

type AppearanceColorMap = {
  default: never;
  button: ColorVariants;
  cta: ColorVariants;
  icon: Extract<ColorVariants, 'default'>;
};

type AppearanceSizeMap = {
  default: never;
  button: SizeVariants;
  cta: SizeVariants;
  icon: SizeVariants;
};

type AppearanceIconsPositionMap = {
  default: never;
  button: IconsPositionVariants;
  cta: IconsPositionVariants;
  icon: never;
};

// Filter out invalid variant types based on the appearance type
type AllowedStyleVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
    ? T[number] extends infer A
      ? A extends LinkAppearances
        ? AppearanceStyleMap[A]
        : never
      : never
    : StyleVariants;

type AllowedColorVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
    ? T[number] extends infer A
      ? A extends LinkAppearances
        ? AppearanceColorMap[A]
        : never
      : never
    : ColorVariants;

type AllowedSizeVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
    ? T[number] extends infer A
      ? A extends LinkAppearances
        ? AppearanceSizeMap[A]
        : never
      : never
    : SizeVariants;

type AllowedIconsPositionVariantsForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
    ? T[number] extends infer A
      ? A extends LinkAppearances
        ? AppearanceIconsPositionMap[A]
        : never
      : never
    : IconsPositionVariants;

export type LinkDestinations = 'reference' | 'custom';

export type LinkType = <T extends LinkAppearances[] | false | undefined = undefined>(options?: {
  appearances?: T;
  variants?: {
    styles?: AllowedStyleVariantsForAppearances<T>[];
    colors?: AllowedColorVariantsForAppearances<T>[];
    sizes?: AllowedSizeVariantsForAppearances<T>[];
    icons?: AllowedIconsPositionVariantsForAppearances<T>[];
  };
  destinations?: LinkDestinations[];
  disableNewTab?: boolean;
  disableLabel?: boolean;
  overrides?: Partial<GroupField>;
}) => Field;
