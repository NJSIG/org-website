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

type LinkAppearances = 'default' | 'button' | 'cta' | 'icon';
export type LinkAppearanceOptions = Record<LinkAppearances, { label: string; value: string }>;

// Define valid values for each variant type
type StyleValues = 'flat' | 'outline' | 'ghost';

type AppearanceStyleMap = {
  default: never;
  button: StyleValues;
  cta: Extract<StyleValues, 'flat' | 'outline'>;
  icon: never;
};

type AllowedStylesForAppearances<T extends LinkAppearances[] | false | undefined> =
  T extends LinkAppearances[]
    ? T[number] extends infer A
      ? A extends LinkAppearances
        ? AppearanceStyleMap[A]
        : never
      : never
    : StyleValues;

export type LinkDestinations = 'reference' | 'custom';

export type LinkType = <T extends LinkAppearances[] | false | undefined = undefined>(options?: {
  appearances?: T;
  variants?: {
    styles?: AllowedStylesForAppearances<T>[];
  };
  destinations?: LinkDestinations[];
  disableNewTab?: boolean;
  disableLabel?: boolean;
  overrides?: Partial<GroupField>;
}) => Field;
