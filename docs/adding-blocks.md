# Adding Blocks to the CMS

This document explains how to create and register a new block in the Payload CMS.

## Overview

Blocks are reusable content units that editors can add to pages. Each block has two parts:

- **`config.ts`** — the Payload CMS field definition (schema, labels, admin UI settings).
- **`Component.tsx`** — the React component that renders the block on the frontend.

Blocks are defined globally in `payload.config.ts` and referenced by slug wherever they are used, following the [Payload block references pattern](https://payloadcms.com/docs/fields/blocks#block-references).

## Directory Structure

Create a new folder under `src/blocks/` named after your block in PascalCase:

```
src/blocks/
  MyNewBlock/
    config.ts        ← Payload block definition
    Component.tsx    ← React render component
```

## 1. Create the Block Config (`config.ts`)

The config defines the block's schema.

> **Important:** The `interfaceName` controls the TypeScript type name generated in `payload-types.ts`. Use `PascalCase` ending in `Block`.

```ts
// src/blocks/MyNewBlock/config.ts
import { Block } from 'payload';

export const MyNewBlock: Block = {
  slug: 'myNewBlock',           // camelCase; must be unique across all blocks
  interfaceName: 'MyNewBlockBlock', // determines the generated TypeScript type name
  labels: {
    singular: 'My New Block',
    plural: 'My New Blocks',
  }, // may be omitted if payload can infer from the slug
  admin: {
    group: 'Buttons & Content', // admin UI group
    images: {
      thumbnail: {
        url: '/blocks/my-new-block/thumb.png',
        alt: 'My New Block',
      },
      icon: {
        url: '/blocks/my-new-block/icon.svg',
        alt: 'My New Block',
      },
    },
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
    },
    // ...add additional fields as needed
  ],
};
```

## 2. Export from the Blocks Index (`src/blocks/index.ts`)

Add your block config export to `src/blocks/index.ts` so it can be imported from `@/blocks`:

```ts
// src/blocks/index.ts
import { MyNewBlock } from './MyNewBlock/config';

// ...existing imports

export {
  // ...existing exports
  MyNewBlock,
};
```

## 3. Register the Block Globally (`src/payload.config.ts`)

All blocks must be registered in the top-level `blocks` array in `payload.config.ts`. This makes the block available by reference everywhere in the CMS without duplicating the schema.

Once added here, run `pnpm generate:types` to update the generated TypeScript types.

```ts
// src/payload.config.ts
import { MyNewBlock } from '@/blocks';

const blocks = [
  // ...existing blocks
  MyNewBlock,
];
```

> **Why this matters:**  Block references (`blockReferences`) offer performance gains over inline block definitions by preventing duplication of block schemas. The block must be registered here before it can be referenced by slug anywhere else.

## 4. Create the React Component (`Component.tsx`)

Import the generated type from `@/payload-types` using the `interfaceName` you set in the config.

```tsx
// src/blocks/MyNewBlock/Component.tsx
import { MyNewBlockBlock as MyNewBlockBlockProps } from '@/payload-types';

export const MyNewBlockBlock: React.FC<MyNewBlockBlockProps> = ({ heading }) => {
  return (
    <div>
      <h2>{heading}</h2>
    </div>
  );
};
```

> **Note:** After registering the block in `payload.config.ts` and running `pnpm payload generate:types`, Payload will generate the `MyNewBlockBlock` interface in `src/payload-types.ts`. Import from there — never define the prop types manually.

## 5. Add the Block to Destination Fields

Depending on where the new block should be available, update one or more of the following destinations.

### Destination A: Top-Level Page Layout (`src/fields/DynamicBlocks/`)

Top-level blocks appear directly in the Pages collection layout. Only structural/layout blocks belong here (e.g., `Section`, `BannerTitle`, `HeroSpinner`).

**`src/fields/DynamicBlocks/types.ts`** — add the generated block type to the `Blocks` union so `BlockSlugs` is inferred correctly:

```ts
import {
  // ...existing imports
  MyNewBlockBlock,
} from '@/payload-types';

type Blocks =
  | BannerTitleBlock
  | HeroSpinnerBlock
  | HiddenTitleBlock
  | MyNewBlockBlock   // ← add here
  | PageTitleBlock
  | SectionBlock;
```

**`src/fields/DynamicBlocks/index.ts`** — add the slug to `allTopLevelBlocks` and the relevant template filter arrays:

```ts
const allTopLevelBlocks: BlockSlugs[] = [
  // ...existing slugs
  'myNewBlock',
];

const defaultBlockFilters: BlockFilters = {
  default: ['bannerTitle', 'hiddenTitle', 'myNewBlock', 'pageTitle', 'section'],
  home:    ['heroSpinner', 'hiddenTitle', 'myNewBlock', 'section'],
  navOnly: [],
};
```

**`src/blocks/RenderBlocks.tsx`** — import the React component and register it in `blockComponents`:

```tsx
import { MyNewBlockBlock } from './MyNewBlock/Component';

const blockComponents = {
  // ...existing entries
  myNewBlock: MyNewBlockBlock,
};
```

### Destination B: Inside the Section Block (`src/blocks/Section/`)

Section blocks appear inside a `Section` layout block. These are content/presentation blocks (e.g., `CMSButton`, `ImageCallout`, `Metrics`).

**`src/blocks/Section/types.ts`** — add the generated block type to the `SectionBlocks` union so `SectionBlockSlugs` is inferred correctly:

```ts
import {
  // ...existing imports
  MyNewBlockBlock,
} from '@/payload-types';

type SectionBlocks =
  | CMSButtonBlock
  | EmphasizedListBlock
  // ...existing types
  | MyNewBlockBlock;  // ← add here
```

**`src/blocks/Section/config.ts`** — add the slug to `allSectionBlocks` and any relevant width filter arrays:

```ts
const allSectionBlocks: SectionBlockSlugs[] = [
  // ...existing slugs
  'myNewBlock',
];

const sectionBlockFilters: SectionBlockFilters = {
  narrow: [
    // ...add 'myNewBlock' here if it should appear in narrow sections
  ],
  normal: allSectionBlocks,
  wide:   allSectionBlocks,
};
```

**`src/blocks/Section/Component.tsx`** — import the React component and register it in `sectionBlockComponents`:

```tsx
import { MyNewBlockBlock } from '@/blocks/MyNewBlock/Component';

const sectionBlockComponents = {
  // ...existing entries
  myNewBlock: MyNewBlockBlock,
};
```

### Destination C: Inside the SectionColumns Block (`src/blocks/Section/blocks/SectionColumns/`)

Column blocks appear inside the left or right column of a `SectionColumns` block. These are typically smaller, self-contained content blocks (e.g., `CMSButton`, `ImageCallout`, `SectionContent`).

**`src/blocks/Section/blocks/SectionColumns/config.ts`** — add the slug to the `blockReferences` array on `colBlocks`:

```ts
{
  name: 'colBlocks',
  type: 'blocks',
  blocks: [],
  blockReferences: [
    // ...existing slugs
    'myNewBlock',
  ],
},
```

**`src/blocks/Section/blocks/SectionColumns/Component.tsx`** — import the React component and register it in `columnBlockComponents`:

```tsx
import { MyNewBlockBlock } from '@/blocks/MyNewBlock/Component';

const columnBlockComponents = {
  // ...existing entries
  myNewBlock: MyNewBlockBlock,
};
```

## 6. Regenerate Types

After completing the steps above, run the Payload type generator to update `src/payload-types.ts` and the Payload import map generator to update `src/app/(payload)/admin/importMap.js`:

```bash
pnpm payload generate:types
pnpm payload generate:importmap
```

This generates the `MyNewBlockBlock` TypeScript interface used in your `Component.tsx` and any required imports.

## Summary Checklist

| Step | File | Action |
|------|------|--------|
| 1 | `src/blocks/MyNewBlock/config.ts` | Create block config with `slug`, `interfaceName`, `labels`, `admin`, and `fields` |
| 2 | `src/blocks/index.ts` | Export the config from the blocks barrel file |
| 3 | `src/payload.config.ts` | Add block to the global `blocks` array |
| 4 | `src/blocks/MyNewBlock/Component.tsx` | Create React component using the generated `payload-types` interface |
| **If top-level page block:** | ||
| 5a | `src/fields/DynamicBlocks/types.ts` | Add generated type to the `Blocks` union |
| 5b | `src/fields/DynamicBlocks/index.ts` | Add slug to `allTopLevelBlocks` and applicable `defaultBlockFilters` |
| 5c | `src/blocks/RenderBlocks.tsx` | Import component and add entry to `blockComponents` |
| **If section block:** | ||
| 5a | `src/blocks/Section/types.ts` | Add generated type to the `SectionBlocks` union |
| 5b | `src/blocks/Section/config.ts` | Add slug to `allSectionBlocks` and applicable `sectionBlockFilters` |
| 5c | `src/blocks/Section/Component.tsx` | Import component and add entry to `sectionBlockComponents` |
| **If column block:** | ||
| 5a | `src/blocks/Section/blocks/SectionColumns/config.ts` | Add slug to `colBlocks.blockReferences` |
| 5b | `src/blocks/Section/blocks/SectionColumns/Component.tsx` | Import component and add entry to `columnBlockComponents` |
| 6 | `src/payload-types.ts` | Run `pnpm payload generate:types` to regenerate |

## Admin UI Thumbnails

Block thumbnails and icons referenced in `admin.images` are served from the `public/blocks/` directory. Add corresponding assets at:

```
public/blocks/my-new-block/thumb.png
public/blocks/my-new-block/icon.svg
```

These are optional but recommended for a consistent editor experience.

> **Note:** The thumbnail image is for the Admin UI block drawer. Preferred aspect ratio for thumbnail images is 3:2 (e.g., 480x320, 600x400). The icon image is for the Lexical editor menus and toolbars (displayed at 20x20px). Use square images or SVGs for best results. Current block images are maintained in Figma.
