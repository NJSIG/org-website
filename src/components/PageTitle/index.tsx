type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-azure-to-r px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 text-foreground-inverted">
        <h2 className="text-3xl font-medium">{title}</h2>
        {subtitle && <p className="max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
};
