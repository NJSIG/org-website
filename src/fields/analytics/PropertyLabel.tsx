'use client';

import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import React from 'react';
import { AnalyticsEvent } from './types';

const PropertyLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<NonNullable<AnalyticsEvent['properties']>[0]>();

  const name = data?.propertyName?.trim() ?? '';
  const value = data?.propertyValue?.trim() ?? '';

  if ((!name || name === '') && (!value || value === '')) {
    return <div>Custom Property {rowNumber}</div>;
  }

  if (!value || value === '') {
    return <div>Custom Property: {name}</div>;
  }

  return (
    <div>
      Custom Property: {name} ⇒ {value}
    </div>
  );
};

export default PropertyLabel;
