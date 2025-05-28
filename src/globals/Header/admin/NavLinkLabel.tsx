'use client';

import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

// We're asserting the type here because it's much less complex than extracting it from the Header type
// and we don't need the full type information for this component.
type NavLinkItem = {
  link: {
    linkTitle: string;
  };
};

const NavLinkLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<NavLinkItem>();

  const label = data?.link.linkTitle
    ? `${data.link.linkTitle}`
    : `Link ${rowNumber ? rowNumber + 1 : ''}`;

  return <div>{label}</div>;
};

export default NavLinkLabel;
