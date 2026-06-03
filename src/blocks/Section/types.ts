import {
  CMSButtonBlock,
  ContactsListBlock,
  EmphasizedListBlock,
  EventTilesBlock,
  IconListBlock,
  ImageCalloutBlock,
  MetricsBlock,
  OptimizedImageBlock,
  RelatedCardsBlock,
  SectionColumnsBlock,
  SectionContentBlock,
  SectionTitleBlock,
} from '@/payload-types';

// Helper type for options
type Options = { label: string; value: string };

export type SectionWidths = 'narrow' | 'normal' | 'wide';
export type SectionWidthOptions = Record<SectionWidths, Options>;

type SectionBlocks =
  | CMSButtonBlock
  | ContactsListBlock
  | EmphasizedListBlock
  | EventTilesBlock
  | IconListBlock
  | ImageCalloutBlock
  | MetricsBlock
  | OptimizedImageBlock
  | RelatedCardsBlock
  | SectionColumnsBlock
  | SectionContentBlock
  | SectionTitleBlock;

export type SectionBlockSlugs = SectionBlocks['blockType'];

export type SectionBlockFilters = {
  [key in SectionWidths]: SectionBlockSlugs[];
};
