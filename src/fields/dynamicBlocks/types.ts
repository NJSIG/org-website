import { HeroSpinnerBlock, SectionBlock } from '@/payload-types';
import { BlocksField, BlocksFieldClient, Field, FieldClientComponent, SelectField } from 'payload';
import { MarkOptional } from 'ts-essentials';

// Helper type for options
type Options = { label: string; value: string };

export type Templates = 'default' | 'home' | 'subfund';
export type TemplateOptions = Record<Templates, Options>;

export type SubfundTheme =
  | 'bacceic'
  | 'caip'
  | 'ericnorth'
  | 'ericsouth'
  | 'ericwest'
  | 'mocssif'
  | 'njeif';
export type SubfundThemeOptions = Record<SubfundTheme, Options>;

type Blocks = HeroSpinnerBlock | SectionBlock;
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
  overrides?: {
    templateField?: Partial<SelectField>;
    subfundThemeField?: Partial<SelectField>;
    blocksField?: Partial<BlocksField>;
  };
}) => Field[];
