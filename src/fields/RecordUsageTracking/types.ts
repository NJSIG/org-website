export type RecordTrackingConsumer = {
  id: string;
  titleField: string;
  title: string;
  collectionSlug: string;
  instances: string[];
};

export type RecordUsageData = {
  id: string;
  href: string;
  title: string;
  collection: string;
  useCount: number;
};

export type RecordUsageTotals = {
  totalUses: number;
  totalConsumers: number;
  totalCollections: number;
};
