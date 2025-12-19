import { cn } from '@/utilities/cn';

export const PageHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}> = ({ children, className, innerClassName }) => {
  return (
    <div className={cn('bg-njsig-background px-6 py-10', className)}>
      <div className={cn('max-w-7xl mx-auto flex flex-col gap-4 text-njsig-shade', innerClassName)}>
        {children}
      </div>
    </div>
  );
};

export const PageTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <h2 className={cn('text-3xl font-extrabold', className)}>{children}</h2>;
};

export const PageSubtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <p className={cn('max-w-2xl text-lg font-medium', className)}>{children}</p>;
};
