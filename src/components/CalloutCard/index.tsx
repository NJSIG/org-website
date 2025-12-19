import { cn } from '@/utilities/cn';

export const CalloutCard: React.FC<{
  shadow: 'left' | 'right' | false;
  children: React.ReactNode;
  className?: string;
}> = ({ shadow, children, className }) => {
  return (
    <div
      className={cn(
        'dark flex flex-col gap-6 p-8 bg-njsig-shade text-foreground-inverted',
        {
          'mb-2 xl:mb-2.5': shadow,
          'shadow-(--callout-shadow-sm-l) xl:shadow-(--callout-shadow-md-l)': shadow === 'left',
          'shadow-(--callout-shadow-sm-r) xl:shadow-(--callout-shadow-md-r)': shadow === 'right',
        },
        className,
      )}
    >
      {children}
    </div>
  );
};
