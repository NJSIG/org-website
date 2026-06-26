import { JSONFieldServerComponent } from 'payload';
import { RecordUsageTrackingFieldClientComponent } from './Component.client';
import { RecordTrackingConsumer, RecordUsageData, RecordUsageTotals } from './types';

export const RecordUsageTrackingFieldComponent: JSONFieldServerComponent = ({ value }) => {
  const transformedData: RecordUsageData[] = transformRecordUsageData(
    value as RecordTrackingConsumer[],
  );

  const totals: RecordUsageTotals = getTotalUses(transformedData);

  return <RecordUsageTrackingFieldClientComponent data={transformedData} totals={totals} />;
};

const transformRecordUsageData = (data: RecordTrackingConsumer[]): RecordUsageData[] => {
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

const getTotalUses = (data: RecordUsageData[]): RecordUsageTotals => {
  const totalUses = data.reduce((acc, item) => acc + item.useCount, 0);
  const totalConsumers = data.length;
  const totalCollections = new Set(data.map((item) => item.collection)).size;

  return {
    totalUses,
    totalConsumers,
    totalCollections,
  };
};
