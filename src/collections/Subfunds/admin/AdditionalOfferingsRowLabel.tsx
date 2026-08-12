'use client';

import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

interface OfferingLabel {
  title?: string;
}

const AdditionalOfferingsRowLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<OfferingLabel>();

  const label =
    data?.title ?? `Additional Offering ${rowNumber !== undefined ? rowNumber + 1 : ''}`;

  return (
    <div className="njsig__link-row-label">
      <span>{label}</span>
    </div>
  );
};

export default AdditionalOfferingsRowLabel;
