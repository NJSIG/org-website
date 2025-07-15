// storage-adapter-import-placeholder
import { HeroSpinner, HiddenTitle, Section } from '@/blocks';
import { CMSButton } from '@/blocks/CMSButton/config';
import { EmphasizedList } from '@/blocks/EmphasizedList/config';
import { OptimizedImage } from '@/blocks/OptimizedImage/config';
import { Events } from '@/collections/Events';
import { Media } from '@/collections/Media';
import { Pages } from '@/collections/Pages';
import { Users } from '@/collections/Users';
import { Footer } from '@/globals/Footer/config';
import { Header } from '@/globals/Header/config';
import { plugins } from '@/plugins';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { EventCards } from './blocks/EventCards/config';
import { ContactPortraits } from './collections/ContactPortraits';
import { Contacts } from './collections/Contacts';
import { Documents } from './collections/Documents';
import { EventCategories } from './collections/EventCategories';
import { Locations } from './collections/Locations';
import { defaultLexical } from './fields/defaultLexical';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Define the collections to be used in the Payload CMS configuration
const collections = [
  Pages,
  Media,
  Documents,
  Events,
  EventCategories,
  Locations,
  Contacts,
  ContactPortraits,
  Users,
];

// Define the blocks to be used in the Payload CMS configuration
// We define all our blocks here so they can be used by reference
const blocks = [
  HeroSpinner,
  HiddenTitle,
  Section.Root,
  Section.Title,
  Section.Columns,
  Section.Content,
  CMSButton,
  OptimizedImage,
  EmphasizedList,
  EventCards,
];

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections,
  globals: [Header, Footer],
  blocks,
  editor: defaultLexical,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  email: nodemailerAdapter({
    defaultFromAddress: 'noreply@njsig.org',
    defaultFromName: 'NJSIG',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  sharp,
  plugins: [...plugins],
});
