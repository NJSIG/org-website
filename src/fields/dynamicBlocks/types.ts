import { HeroBlock, SectionBlock } from '@/payload-types';
import { BlocksField, BlocksFieldClient, Field, FieldClientComponent, SelectField } from 'payload';
import { MarkOptional } from 'ts-essentials';

// Helper type for options
type Options = { label: string; value: string };

export type Templates = 'default' | 'home' | 'subfund';
export type TemplateOptions = Record<Templates, Options>;

type Blocks = HeroBlock | SectionBlock;
export type BlockSlugs = Blocks['blockType'];

export type AllowedBlocks = {
  [key in Templates]: BlockSlugs[];
};

type BlocksFieldClientWithoutType = MarkOptional<BlocksFieldClient, 'type'>;

type DynamicBlocksBaseClientProps = {
  readonly allowedBlocks: AllowedBlocks;
  readonly path: string;
};

export type DynamicBlocksFieldClientComponent = FieldClientComponent<
  BlocksFieldClientWithoutType,
  DynamicBlocksBaseClientProps
>;

export type DynamicBlocksType = (options?: {
  allowedBlocks?: AllowedBlocks;
  templateOverrides?: Partial<SelectField>;
  blocksOverrides?: Partial<BlocksField>;
}) => Field[];
