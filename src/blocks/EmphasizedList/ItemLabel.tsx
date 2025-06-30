'use client';

import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

interface ItemLabel {
  title: string;
}

const ItemLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<ItemLabel>();
  const label = data?.title && data.title !== '' ? data.title : `Item ${(rowNumber ?? 0) + 1}`;

  return <div>{label}</div>;
};

export default ItemLabel;
