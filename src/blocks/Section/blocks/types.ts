import {
  CMSButtonBlock,
  EmphasizedListBlock,
  EventTilesBlock,
  IconListBlock,
  ImageCalloutBlock,
  MetricsBlock,
  OptimizedImageBlock,
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
  | EmphasizedListBlock
  | EventTilesBlock
  | IconListBlock
  | ImageCalloutBlock
  | MetricsBlock
  | OptimizedImageBlock
  | SectionColumnsBlock
  | SectionContentBlock
  | SectionTitleBlock;

export type SectionBlockSlugs = SectionBlocks['blockType'];

export type SectionBlockFilters = {
  [key in SectionWidths]: SectionBlockSlugs[];
};
