'use client';

import { Footer } from '@/payload-types';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import React from 'react';

const GroupRowLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<NonNullable<Footer['navGroups']>[number]>();

  const label = data?.label
    ? `Group ${rowNumber !== undefined ? rowNumber + 1 : ''}: ${data.label}`
    : 'Row';

  return <div>{label}</div>;
};

export default GroupRowLabel;
