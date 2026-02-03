'use client';

import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import React from 'react';

interface PropertyLabel {
  id?: string;
  propertyName?: string;
  propertyValue?: string;
}

const PropertyLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<PropertyLabel>();

  const name = data?.propertyName?.trim() ?? '';
  const value = data?.propertyValue?.trim() ?? '';

  if (!name && !value) {
    return `Custom Property ${rowNumber}`;
  }

  if (!value) {
    return `Custom Property: ${name}`;
  }

  return `Custom Property: ${name} ⇒ ${value}`;
};

export default PropertyLabel;
