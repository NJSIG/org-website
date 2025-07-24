import { cn } from '@/utilities/cn';

type SubfundPillProps = {
  theme?: string | null;
  label: string;
};

export const SubfundPill: React.FC<SubfundPillProps> = ({ theme = 'other', label }) => {
  return (
    <span
      className={cn('px-2 py-0.5 rounded-lg text-xs font-medium bg-njsig-neutral-tint', {
        'bg-bacceic-tint': theme === 'bacceic',
        'bg-caip-tint': theme === 'caip',
        'bg-ericnorth-tint': theme === 'eric-north',
        'bg-ericsouth-tint': theme === 'eric-south',
        'bg-ericwest-tint': theme === 'eric-west',
        'bg-mocssif-tint': theme === 'mocssif',
        'bg-njeif-tint': theme === 'njeif',
        'bg-njsig-tint': theme === 'njsig',
      })}
    >
      {label}
    </span>
  );
};
