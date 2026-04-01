'use client';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

interface ItemLabel {
  title: string;
}

const ItemLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<ItemLabel>();
  const trimmedLabel = data?.title?.trim();

  return (
    <div className="njsig__row-label">
      <span>{trimmedLabel ?? `Item ${(rowNumber ?? 0) + 1}`}</span>
    </div>
  );
};

export default ItemLabel;
