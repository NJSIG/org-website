import { LegalNoticeTypes } from '@/collections/LegalNotices/types';
import { RichText } from '@/components/RichText';
import { LegalNotice } from '@/payload-types';
import { appendOrdinalSuffix } from '@/utilities/appendOrdinalSuffix';
import { cn } from '@/utilities/cn';
import { Temporal } from '@js-temporal/polyfill';

export const LegalNoticeCard: React.FC<LegalNotice> = ({
  noticeType,
  title,
  content,
  postingDate: postingDateFromProps,
  closeDate: closeDateFromProps,
  rfpTracking,
  resources,
}) => {
  const postingDate = Temporal.PlainDate.from(postingDateFromProps.slice(0, 10));
  const closeDate = closeDateFromProps
    ? Temporal.PlainDate.from(closeDateFromProps.slice(0, 10))
    : undefined;

  return (
    <div className="rounded-3xl bg-njsig-neutral-tint p-4">
      <LegalNoticeCardMeta open={postingDate} close={closeDate} type={noticeType} />
      <h3 className="text-lg font-bold">{title}</h3>
      <RichText data={content} className="prose-base max-w-full" />
    </div>
  );
};

const LegalNoticeCardMeta: React.FC<{
  open: Temporal.PlainDate;
  close: Temporal.PlainDate | undefined;
  type: string;
}> = ({ open, close, type }) => {
  const openMonth = open.toLocaleString('en-US', { month: 'long' });
  const openDay = appendOrdinalSuffix(open.day);
  const openDateString = `${openMonth} ${openDay}, ${open.year}`;

  let closeDateString: string | undefined = undefined;

  if (close) {
    const closeMonth = close.toLocaleString('en-US', { month: 'long' });
    const closeDay = appendOrdinalSuffix(close.day);
    closeDateString = `${closeMonth} ${closeDay}, ${close.year}`;
  }

  const noticeType = Object.values(LegalNoticeTypes).find((t) => t.value === type);

  return (
    <small className={cn('text-njsig-neutral-muted text-sm')}>
      {noticeType ? `${noticeType.label} | ` : ''}
      {openDateString}
      {closeDateString ? ` &mdash; ${closeDateString}` : ''}
    </small>
  );
};
