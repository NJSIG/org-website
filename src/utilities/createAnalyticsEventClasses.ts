import { AnalyticsEvent } from '@/fields/analytics/types';

export const createAnalyticsEventClasses = (analytics: AnalyticsEvent | undefined): string => {
  const classNames = [];

  if (analytics?.hasAnalyticsEvent) {
    if (analytics.eventName) {
      classNames.push(`plausible-event-name=${analytics.eventName}`);
    }

    analytics.properties?.forEach(({ propertyName, propertyValue }) => {
      classNames.push(`plausible-event-${propertyName}=${propertyValue}`);
    });
  }

  return classNames.join(' ').trim();
};
