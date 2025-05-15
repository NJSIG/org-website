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
  microInteraction?: MicroInteractionVariants | false | undefined;
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

// Micro Interaction Variants
export type MicroInteractionVariants = 'none' | 'wiggle' | 'upRight';
export type MicroInteractionVariantOptions = Record<MicroInteractionVariants, Options>;

type AppearanceMicroInteractionMap = {
  button: MicroInteractionVariants;
  cta: MicroInteractionVariants;
  icon: Extract<MicroInteractionVariants, 'none' | 'wiggle'>;
};

export type AllowedMicroInteractionVariantsForAppearances<
  T extends LinkAppearances[] | false | undefined,
> = T extends LinkAppearances[]
  ? T[number] extends infer A
    ? A extends LinkAppearances
      ? AppearanceMicroInteractionMap[A]
      : never
    : never
  : MicroInteractionVariants;

// Final Link Type
export type LinkType = <T extends LinkAppearances[] | false | undefined = undefined>(options?: {
  appearances?: T;
  variants?: {
    styles?: AllowedStyleVariantsForAppearances<T>[] | false | undefined;
    colors?: AllowedColorVariantsForAppearances<T>[] | false | undefined;
    sizes?: AllowedSizeVariantsForAppearances<T>[] | false | undefined;
    icons?: AllowedIconsPositionVariantsForAppearances<T>[] | false | undefined;
    microInteractions?: AllowedMicroInteractionVariantsForAppearances<T>[] | false | undefined;
  };
  destinations?: LinkDestinations[];
  disableNewTab?: boolean;
  disableLabel?: boolean;
  overrides?: Partial<GroupField>;
}) => Field;

// Appearance Helper Type
// Use this when forcing a specific appearance in a hook
export type LinkAppearanceHelper<T extends LinkAppearances> = {
  appearance: T;
  styleVariant: AppearanceStyleMap[T] extends never ? never : AppearanceStyleMap[T];
  colorVariant: AppearanceColorMap[T];
  sizeVariant: AppearanceSizeMap[T];
  iconPosition: AppearanceIconsPositionMap[T] extends never ? never : AppearanceIconsPositionMap[T];
  icon: IconNames | null | undefined;
  microInteraction: AppearanceMicroInteractionMap[T] extends never
    ? never
    : AppearanceMicroInteractionMap[T];
};

// Usage Examples for the Appearance Helper Type
// Usage examples with proper type restrictions:
// const buttonAppearance: LinkAppearanceHelper<'button'> = {
//   appearance: "button",
//   styleVariant: "flat", // Only allows: 'flat', 'outline', or 'ghost'
//   colorVariant: "primary", // Only allows: 'primary' or 'accent'
//   sizeVariant: "medium", // Only allows: 'small' or 'medium'
//   iconPosition: "after", // Only allows: 'none', 'before', or 'after'
//   icon: "arrow-up-right",
//   microInteraction: "wiggle", // Only allows: 'none', 'wiggle', or 'up-right'
// };

// const ctaAppearance: LinkAppearanceHelper<'cta'> = {
//   appearance: "cta",
//   styleVariant: "outline", // Only allows: 'flat' or 'outline'
//   colorVariant: "accent", // Only allows: 'primary' or 'accent'
//   sizeVariant: "large", // Only allows: 'medium' or 'large'
//   iconPosition: "before", // Only allows: 'none', 'before', or 'after'
//   icon: "arrow-right",
//   microInteraction: "up-right", // Only allows: 'none', 'wiggle', or 'up-right'
// };

// const iconAppearance: LinkAppearanceHelper<'icon'> = {
//   appearance: "icon",
//   styleVariant: undefined as never, // Must be never/undefined since icons have no style
//   colorVariant: "default", // Only allows: 'default'
//   sizeVariant: "small", // Only allows: 'small' or 'medium'
//   iconPosition: undefined as never, // Must be never/undefined since icons have no position
//   icon: "settings", // Required for icon appearance
//   microInteraction: "wiggle", // Only allows: 'none', 'wiggle'
// };
