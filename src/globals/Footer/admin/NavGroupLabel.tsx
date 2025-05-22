'use client';

import { Footer } from '@/payload-types';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import React from 'react';

const NavGroupLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<NonNullable<Footer['navGroups']>[number]>();

  const label = data?.label
    ? `${data.label}`
    : `Navigation Group ${rowNumber ? rowNumber + 1 : ''}`;

  return <div>{label}</div>;
};

export default NavGroupLabel;
