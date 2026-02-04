export type AnalyticsEvent = {
  hasAnalyticsEvent?: boolean | null | undefined;
  eventName?: string | null | undefined;
  properties?:
    | {
        propertyName: string;
        propertyValue: string;
        id?: string | null | undefined;
      }[]
    | null
    | undefined;
};
