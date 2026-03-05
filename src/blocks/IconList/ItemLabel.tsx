'use client';

import DynamicIcon from '@/components/DynamicIcon';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

interface ItemLabel {
  icon: string;
  title?: string | null;
  text?: string | null;
}

const ItemLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<ItemLabel>();
  const label =
    data?.title && data.title !== ''
      ? data.title
      : data?.text && data.text !== ''
        ? `${data.text.slice(0, 25)}...`
        : `Item ${(rowNumber ?? 0) + 1}`;

  return (
    <div className="njsig__row-label">
      {data?.icon && <DynamicIcon name={data.icon} />}
      <span>{label}</span>
    </div>
  );
};

export default ItemLabel;
