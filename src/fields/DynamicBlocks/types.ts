import {
  BannerTitleBlock,
  HeroSpinnerBlock,
  HiddenTitleBlock,
  PageTitleBlock,
  SectionBlock,
} from '@/payload-types';
import { Field, SelectField } from 'payload';

// Helper type for options
type Options = { label: string; value: string };

export type Templates = 'default' | 'home' | 'navOnly';
export type TemplateOptions = Record<Templates, Options>;

type Blocks =
  | BannerTitleBlock
  | HeroSpinnerBlock
  | HiddenTitleBlock
  | PageTitleBlock
  | SectionBlock;
export type BlockSlugs = Blocks['blockType'];

export type BlockFilters = {
  [key in Templates]: BlockSlugs[];
};

export type DynamicBlocksType = (options?: {
  blockFilters?: BlockFilters;
  localized?: boolean;
  overrides?: {
    templateField?: Partial<SelectField>;
  };
}) => Field[];
