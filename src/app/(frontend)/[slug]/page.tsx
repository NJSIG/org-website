import { PayloadRedirects } from '@/components/PayloadRedirects';
import { generateMetaGraph } from '@/utilities/generateMetaGraph';
import configPromise from '@payload-config';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getPayload, RequiredDataFromCollectionSlug } from 'payload';
import { cache } from 'react';

type Args = {
  params: Promise<{ slug?: string }>;
};

/**
 * This function is used to query a page by its slug.
 * It uses the Payload CMS to find the page in the 'pages' collection.
 * It also checks if the draft mode is enabled and uses that to query the page.
 * @param slug - The slug of the page to query.
 * @returns The page object if found, otherwise null.
 */
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});

/**
 * This function generates static parameters for the pages.
 * It queries the Payload CMS to get all the pages in the 'pages' collection.
 * It filters out the 'home' page and returns the slugs of the other pages.
 * This is used for static generation of the pages.
 */
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home';
    })
    .map(({ slug }) => {
      return { slug };
    });

  return params;
}

/**
 * This function generates metadata for a page based on its slug.
 */
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise;
  const page = await queryPageBySlug({ slug });

  return generateMetaGraph({ doc: page });
}

/**
 * This function is used to render a page based on its slug.
 * It queries the page from the Payload CMS and checks if it exists.
 * If the page does not exist, it redirects to the specified URL.
 * If the page exists, it renders the page content.
 */
export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = 'home' } = await paramsPromise;
  const url = '/' + slug;
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({ slug });

  if (!page) {
    return <PayloadRedirects url={url} />;
  }

  // TODO: Render Page
  return (
    <article>
      <h1>{page.title}</h1>
      <h3>TODO: Render the page content here.</h3>
    </article>
  );
}
