export type DocumentConsumer = {
  id: string;
  titleField: string;
  title: string;
  collectionSlug: string;
  instances: string[];
};

export type DocumentUsageData = {
  id: string;
  href: string;
  title: string;
  collection: string;
  useCount: number;
};

export type DocumentUsageTotals = {
  totalUses: number;
  totalConsumers: number;
  totalCollections: number;
};

export type TrackedDocument = {
  id: string;
  consumers?: DocumentConsumer[];
};

export type ConsumerDocument = Record<string, unknown>;
