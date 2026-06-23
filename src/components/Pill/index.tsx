import { cn } from '@/utilities/cn';

type PillProps = {
  label: string;
  color?: string | null;
  className?: string;
};

export const Pill: React.FC<PillProps> = ({ color = 'neutral', label, className }) => {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-lg text-xs font-medium bg-njsig-neutral-midtone text-foreground text-nowrap',
        {
          'bg-glacial-300': color === 'glacial',
          'bg-sea-green-300': color === 'sea-green',
          'bg-cerulean-300': color === 'cerulean',
          'bg-sushi-300': color === 'sushi',
          'bg-trendy-pink-300': color === 'trendy-pink',
          'bg-tahiti-gold-300': color === 'tahiti-gold',
          'bg-raspberry-300': color === 'raspberry',
          'bg-njsig-tint': color === 'primary',
          'bg-njsig-accent-tint': color === 'accent',
          'bg-njsig-neutral-tint': color === 'neutral',
        },
        className,
      )}
    >
      {label}
    </span>
  );
};
