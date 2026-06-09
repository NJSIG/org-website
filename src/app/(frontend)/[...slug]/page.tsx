import { RenderBlocks } from '@/blocks/RenderBlocks';
import { LivePreviewListener } from '@/components/LivePreviewListener';
import { PayloadRedirects } from '@/components/PayloadRedirects';
import { generateMetaGraph } from '@/utilities/generateMetaGraph';
import { getPagePath } from '@/utilities/getPagePath';
import configPromise from '@payload-config';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload, RequiredDataFromCollectionSlug } from 'payload';
import { cache } from 'react';
import PageClient from './page.client';

type Args = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const getRequestedPath = async (
  paramsPromise: Args['params'],
  searchParamsPromise?: Args['searchParams'],
) => {
  const { slug = [] } = await paramsPromise;
  const searchParams = searchParamsPromise ? await searchParamsPromise : undefined;

  const decodedSegments = slug.map((segment) => decodeURIComponent(segment)).filter(Boolean);

  if (decodedSegments.length === 0) {
    return {
      leafSlug: 'home',
      requestedPath: '/',
      searchParams,
    };
  }

  return {
    leafSlug: decodedSegments[decodedSegments.length - 1],
    requestedPath: `/${decodedSegments.join('/')}`,
    searchParams,
  };
};

/**
 * Query page data by leaf slug. Slugs remain globally unique, then URL is verified against breadcrumbs.
 */
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});

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
      breadcrumbs: true,
    },
  });

  const params = pages.docs
    ?.map((doc) => getPagePath(doc))
    .filter((path): path is string => Boolean(path && path !== '/'))
    .map((path) => ({
      slug: path.split('/').filter(Boolean),
    }));

  return params;
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { leafSlug } = await getRequestedPath(paramsPromise);
  const page = await queryPageBySlug({ slug: leafSlug });

  return generateMetaGraph({ doc: page });
}

export default async function Page({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { isEnabled: draft } = await draftMode();
  const { leafSlug, requestedPath, searchParams } = await getRequestedPath(
    paramsPromise,
    searchParamsPromise,
  );
  const page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: leafSlug,
  });

  if (!page) {
    return <PayloadRedirects url={requestedPath} />;
  }

  const canonicalPath = getPagePath(page);

  if (canonicalPath && canonicalPath !== requestedPath) {
    redirect(canonicalPath);
  }

  const {
    layout: { template, blocks },
  } = page;

  return (
    <article>
      <PageClient template={template} />

      {draft && <LivePreviewListener />}

      <RenderBlocks blocks={blocks} searchParams={searchParams} />
    </article>
  );
}
