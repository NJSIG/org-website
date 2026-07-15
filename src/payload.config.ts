// storage-adapter-import-placeholder
import {
  BannerTitle,
  CMSButton,
  CollectionList,
  EmphasizedList,
  EventTiles,
  HeroSpinner,
  HiddenTitle,
  IconList,
  ImageCallout,
  Metrics,
  OptimizedImage,
  PageTitle,
  RelatedCards,
  Section,
} from '@/blocks';
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
import { admin } from './access';
import { ContactPortraits } from './collections/ContactPortraits';
import { Contacts } from './collections/Contacts';
import { Documents } from './collections/Documents';
import { EventCategories } from './collections/EventCategories';
import { HeroImages } from './collections/HeroImages';
import { LegalNotices } from './collections/LegalNotices';
import { Locations } from './collections/Locations';
import { Subfunds } from './collections/Subfunds';
import { defaultLexical } from './fields/DefaultLexical';
import { createSyncRecordUsageTitles } from './fields/RecordUsageTracking/tasks/createSyncRecordUsageTitles';
import { User } from './payload-types';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Define the collections to be used in the Payload CMS configuration
const collections = [
  // Collections Group
  Pages,
  Subfunds,
  Events,
  LegalNotices,
  Locations,
  Contacts,
  // Media Group
  Media,
  Documents,
  HeroImages,
  ContactPortraits,
  // Administration Group
  Users,
  EventCategories,
];

// Define the blocks to be used in the Payload CMS configuration
// We define all our blocks here so they can be used by reference
// Defining blocks multiple time can bloat the config and information sent to the client
// see https://payloadcms.com/docs/fields/blocks#block-references
const blocks = [
  BannerTitle,
  CMSButton,
  CollectionList,
  EmphasizedList,
  EventTiles,
  HeroSpinner,
  HiddenTitle,
  IconList,
  ImageCallout,
  Metrics,
  OptimizedImage,
  PageTitle,
  RelatedCards,
  Section.Columns,
  Section.Content,
  Section.Root,
  Section.Title,
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
    timezones: {
      defaultTimezone: 'America/New_York',
    },
    components: {
      providers: ['@/providers/admin#AdminProviders'],
      views: {
        analytics: {
          Component: '@/admin/views/PlausibleView#AnalyticsView',
          path: '/analytics',
        },
      },
      afterNavLinks: [{ path: '@/admin/components/AfterNavLinks#AfterNavLinks' }],
    },
  },
  collections,
  globals: [Header, Footer],
  blocks,
  editor: defaultLexical,
  secret: process.env.PAYLOAD_SECRET || '',
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'en',
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    connectOptions: {
      dbName: 'payload',
    },
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
  jobs: {
    access: {
      cancel: admin,
      queue: admin,
      run: admin,
    },
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {};
      }

      defaultJobsCollection.admin.group = 'Administration';
      defaultJobsCollection.admin.hidden = ({ user }) => {
        if (!user) {
          return true;
        }

        return (user as User).role !== 'admin';
      };

      if (!defaultJobsCollection.access) {
        defaultJobsCollection.access = {};
      }

      defaultJobsCollection.access.read = admin;
      defaultJobsCollection.access.create = admin;
      defaultJobsCollection.access.update = admin;
      defaultJobsCollection.access.delete = admin;

      return defaultJobsCollection;
    },
    tasks: [
      {
        slug: 'test-task',
        schedule: [
          {
            cron: '12 15 * * *', // 3:12 PM every day
            queue: 'maintenance', // Use the "maintenance" queue for this task
          },
        ],
        handler: async ({ req }) => {
          const { payload } = req;

          // Example task logic
          const result = await payload.find({
            collection: 'pages',
            limit: 10,
          });

          return {
            state: 'succeeded',
            output: {
              message: `Found ${result.totalDocs} pages.`,
            },
          };
        },
      },
      createSyncRecordUsageTitles({
        taskSlug: 'sync-hero-image-usage-titles',
        collectionSlug: 'hero-images',
        schedule: [
          {
            cron: '45 14 * * *', // 2:45 PM every day
            queue: 'maintenance', // Use the "maintenance" queue for this task
          },
        ],
      }),
      createSyncRecordUsageTitles({
        taskSlug: 'sync-contact-portrait-usage-titles',
        collectionSlug: 'contact-portraits',
        schedule: [
          {
            cron: '45 14 * * *', // 2:45 PM every day
            queue: 'maintenance', // Use the "maintenance" queue for this task
          },
        ],
      }),
      createSyncRecordUsageTitles({
        taskSlug: 'sync-document-usage-titles',
        collectionSlug: 'documents',
        schedule: [
          {
            cron: '45 14 * * *', // 2:45 PM every day
            queue: 'maintenance', // Use the "maintenance" queue for this task
          },
        ],
      }),
      createSyncRecordUsageTitles({
        taskSlug: 'sync-media-usage-titles',
        collectionSlug: 'media',
        schedule: [
          {
            cron: '45 14 * * *', // 2:45 PM every day
            queue: 'maintenance', // Use the "maintenance" queue for this task
          },
        ],
      }),
    ],
    autoRun: [
      // {
      //   cron: '* 22-23 * * *', // Run every hour from 10:00 PM to 11:59 PM
      //   queue: 'maintenance', // Process "maintenance" queue
      // },
      // {
      //   cron: '* 0-5 * * *', // Run every hour from 12:00 AM to 5:59 AM
      //   queue: 'maintenance', // Process "maintenance" queue
      // },
      {
        cron: '* * * * *', // Run every minute
        queue: 'maintenance', // Process "maintenance" queue
      },
    ],
  },
  sharp,
  plugins: [...plugins],
});
