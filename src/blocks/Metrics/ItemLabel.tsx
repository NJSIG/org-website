'use client';

import DynamicIcon from '@/components/DynamicIcon';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

interface ItemLabel {
  icon: string;
  iconBackgroundColor: string;
  value: number;
  label: string;
}

const ItemLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<ItemLabel>();
  const trimmedLabel = data?.label?.trim();
  const hasValue = data?.value !== null && data?.value !== undefined;
  const label =
    hasValue && trimmedLabel
      ? `${data?.value} | ${trimmedLabel}`
      : `Item ${(rowNumber ?? 0) + 1}`;

  return (
    <div className="njsig__row-label">
      {data?.icon && (
        <div
          data-color={data?.iconBackgroundColor ?? 'default'}
          className="njsig__row-label__contained-icon"
        >
          <DynamicIcon name={data.icon} size={16} />
        </div>
      )}
      <span>{label}</span>
    </div>
  );
};

export default ItemLabel;
