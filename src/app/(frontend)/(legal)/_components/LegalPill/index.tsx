import { cn } from '@/utilities/cn';

type LegalPillProps = {
  type: 'trusteeMeeting' | 'legalNotice' | 'contracting' | 'other';
  label: string;
};

export const LegalPill: React.FC<LegalPillProps> = ({ type = 'other', label }) => {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-lg text-xs font-medium bg-njsig-neutral-midtone text-foreground text-nowrap',
        {
          'bg-caip-tint': type === 'trusteeMeeting',
          'bg-mocssif-tint': type === 'contracting',
          'bg-njsig-tint': type === 'legalNotice',
        },
      )}
    >
      {label}
    </span>
  );
};
