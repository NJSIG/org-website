import { cn } from '@/utilities/cn';

export const CalloutCard: React.FC<{
  shadow: 'left' | 'right' | false;
  children: React.ReactNode;
  className?: string;
}> = ({ shadow, children, className }) => {
  return (
    <div
      className={cn(
        'dark flex flex-col gap-6 p-8 bg-njsig-shade text-foreground-inverted rounded-lg relative',
        className,
      )}
    >
      {children}
      {shadow && (
        <div
          className={cn(
            'absolute h-full w-full -z-1 bg-njsig-accent-midtone rounded-lg -bottom-2 xl:-bottom-2.5',
            {
              '-left-2 xl:-left-2.5 rounded-bl-2xl xl:rounded-bl-[18px]': shadow === 'left',
              '-right-2 xl:-right-2.5 rounded-br-2xl xl:rounded-br-[18px]': shadow === 'right',
            },
          )}
        />
      )}
    </div>
  );
};
