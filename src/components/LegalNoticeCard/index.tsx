'use client';

import { LegalNoticeTypes, LegalNoticeTypeValue } from '@/collections/LegalNotices/types';
import { RichText } from '@/components/RichText';
import { LegalNotice } from '@/payload-types';
import { Pill, PillVariantProps } from '@/primitives/ui/pill';
import { appendOrdinalSuffix } from '@/utilities/appendOrdinalSuffix';
import { cn } from '@/utilities/cn';
import { Temporal } from '@js-temporal/polyfill';
import ResourceList from '../ResourceList';

const noticeColors: Record<LegalNoticeTypeValue, PillVariantProps['color']> = {
  legalNotice: 'primary',
  rfp: 'tahiti-gold',
  rfpAward: 'sea-green',
};

export const LegalNoticeCard: React.FC<LegalNotice> = ({
  noticeType: noticeTypeFromProps,
  title,
  content,
  postingDate: postingDateFromProps,
  closeDate: closeDateFromProps,
  rfpTracking,
  resources,
  important,
}) => {
  const noticeType = Object.values(LegalNoticeTypes).find((t) => t.value === noticeTypeFromProps);
  const postingDate = postingDateFromProps
    ? Temporal.PlainDate.from(postingDateFromProps.slice(0, 10))
    : undefined;
  const closeDate = closeDateFromProps
    ? Temporal.PlainDate.from(closeDateFromProps.slice(0, 10))
    : undefined;

  return (
    <div
      className={cn('rounded-3xl bg-njsig-neutral-tint p-4 mx-auto', {
        'border-2 border-njsig-accent-midtone': important,
      })}
    >
      <LegalNoticeCardMeta
        open={postingDate}
        close={closeDate}
        type={noticeType}
        important={important}
      />
      <RichText data={content} className="prose-base max-w-full mt-2" />
      {resources && resources.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-bold mt-4">Resources</h4>
          <ResourceList resources={resources} nested />
        </div>
      )}
      {(noticeType?.value === LegalNoticeTypes.RFP.value ||
        noticeType?.value === LegalNoticeTypes.RFPAward.value) &&
        rfpTracking && <small className="mt-2 block">RFP Tracking Number: {rfpTracking}</small>}
    </div>
  );
};

const LegalNoticeCardMeta: React.FC<{
  open: Temporal.PlainDate | undefined;
  close: Temporal.PlainDate | undefined;
  type: (typeof LegalNoticeTypes)[keyof typeof LegalNoticeTypes] | undefined;
  important?: boolean | null;
}> = ({ open, close, type, important }) => {
  let datesString: string | undefined;

  const openMonth = open?.toLocaleString('en-US', { month: 'long' });
  const openDay = open ? appendOrdinalSuffix(open.day) : '';

  datesString = open ? `${openMonth} ${openDay}, ${open.year}` : undefined;

  if (close) {
    const closeMonth = close.toLocaleString('en-US', { month: 'long' });
    const closeDay = appendOrdinalSuffix(close.day);

    datesString = datesString
      ? `${datesString} — ${closeMonth} ${closeDay}, ${close.year}`
      : datesString;
  }

  let noticeColor: PillVariantProps['color'] = noticeColors[type?.value || 'legalNotice'];

  return (
    <small className="text-njsig-neutral-muted text-sm flex items-center gap-2">
      <Pill color={noticeColor} label={type?.label || 'Unknown'} />
      {important && <Pill color="accent" label="Important Notice" />}
      <span>{datesString}</span>
    </small>
  );
};
