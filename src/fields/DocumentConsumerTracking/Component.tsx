import { JSONFieldServerComponent } from 'payload';
import { DocumentConsumerTrackingFieldClientComponent } from './Component.client';
import { DocumentConsumer, DocumentUsageData, DocumentUsageTotals } from './types';

export const DocumentConsumerTrackingFieldComponent: JSONFieldServerComponent = ({ value }) => {
  const transformedData: DocumentUsageData[] = transformDocumentUsageData(
    value as DocumentConsumer[],
  );

  const totals: DocumentUsageTotals = getTotalUses(transformedData);

  return <DocumentConsumerTrackingFieldClientComponent data={transformedData} totals={totals} />;
};

const transformDocumentUsageData = (data: DocumentConsumer[]): DocumentUsageData[] => {
  return (
    data
      // Transform the data with href, readable collection name, and use count
      .map((consumer) => ({
        id: consumer.id,
        href: `/admin/collections/${consumer.collectionSlug}/${consumer.id}`,
        title: consumer.title,
        collection: humanReadableCollectionName(consumer.collectionSlug),
        useCount: consumer.instances.length,
      }))
      // Sort the data by title in ascending order
      .sort((a, b) => a.title.localeCompare(b.title))
  );
};

const humanReadableCollectionName = (slug: string): string => {
  // Convert slug to human-readable format, e.g., "blog-posts" -> "Blog Posts"
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getTotalUses = (data: DocumentUsageData[]): DocumentUsageTotals => {
  const totalUses = data.reduce((acc, item) => acc + item.useCount, 0);
  const totalConsumers = data.length;
  const totalCollections = new Set(data.map((item) => item.collection)).size;

  return {
    totalUses,
    totalConsumers,
    totalCollections,
  };
};
