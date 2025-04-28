'use client';

import { Header } from '@/payload-types';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

const NavRowLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<NonNullable<Header['navGroups']>[number]>();

  const label = data?.buttonText
    ? `${data.buttonText}`
    : `Navigation Group ${rowNumber ? rowNumber + 1 : ''}`;

  return <div>{label}</div>;
};

export default NavRowLabel;
