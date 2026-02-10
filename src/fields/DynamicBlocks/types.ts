import {
  BannerTitleBlock,
  HeroSpinnerBlock,
  HiddenTitleBlock,
  SectionBlock,
} from '@/payload-types';
import { Field, SelectField } from 'payload';

// Helper type for options
type Options = { label: string; value: string };

export type Templates = 'default' | 'home' | 'navOnly';
export type TemplateOptions = Record<Templates, Options>;

type Blocks = HeroSpinnerBlock | HiddenTitleBlock | BannerTitleBlock | SectionBlock;
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
