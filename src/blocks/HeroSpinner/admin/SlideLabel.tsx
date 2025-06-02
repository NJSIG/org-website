'use client';

import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

interface SlideLabel {
  theme: string;
  headline: string;
}

const SlideLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<SlideLabel>();

  const theme =
    data?.theme && data.theme !== ''
      ? data.theme
      : `Slide ${rowNumber !== undefined ? rowNumber + 1 : ''}`;
  const headline = data?.headline;

  return (
    <div className="njsig__hero-slide-row-label">
      <span className="njsig__hero-slide-row-label__theme">{theme}</span>
      {headline && headline !== '' && (
        <span className="njsig__hero-slide-row-label__headline"> | {headline}</span>
      )}
    </div>
  );
};

export default SlideLabel;
