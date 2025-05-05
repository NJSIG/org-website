'use client';

import { Header } from '@/payload-types';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

const NavLinkLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } =
    useRowLabel<NonNullable<NonNullable<Header['navGroups']>[number]['links']>[number]>();

  const label = data?.link.linkTitle
    ? `${data.link.linkTitle}`
    : `Link ${rowNumber ? rowNumber + 1 : ''}`;

  return <div>{label}</div>;
};

export default NavLinkLabel;
