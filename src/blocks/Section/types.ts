import {
  CMSButtonBlock,
  CollectionListBlock,
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
import { OptionObject } from 'payload';

export type SectionWidths = 'narrow' | 'normal' | 'wide';
export type SectionWidthOptions = Record<SectionWidths, OptionObject>;

type SectionBlocks =
  | CMSButtonBlock
  | CollectionListBlock
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
