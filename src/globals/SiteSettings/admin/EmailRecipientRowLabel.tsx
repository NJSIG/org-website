'use client';

import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

interface RecipientLabel {
  email?: string;
  name?: string;
}

const RecipientLabelRowLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<RecipientLabel>();

  const label = data?.name
    ? `${data.name} ${data.email ? `<${data.email}>` : ''}`
    : `Recipient ${rowNumber !== undefined ? rowNumber + 1 : ''}`;

  return (
    <div>
      <span>{label}</span>
    </div>
  );
};

export default RecipientLabelRowLabel;
