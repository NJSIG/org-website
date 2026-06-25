import { Pill, PillVariantProps } from '@/primitives/ui/pill';

type SubfundPillProps = {
  theme?: string | null;
  label: string;
};

export const SubfundPill: React.FC<SubfundPillProps> = ({ theme, label }) => {
  let color: PillVariantProps['color'] | undefined;

  switch (theme) {
    case 'bacceic':
      color = 'glacial';
      break;
    case 'caip':
      color = 'sea-green';
      break;
    case 'eric-north':
      color = 'cerulean';
      break;
    case 'eric-south':
      color = 'sushi';
      break;
    case 'eric-west':
      color = 'trendy-pink';
      break;
    case 'mocssif':
      color = 'tahiti-gold';
      break;
    case 'njeif':
      color = 'raspberry';
      break;
    case 'njsig':
      color = 'primary';
      break;
    default:
      color = undefined;
  }

  return <Pill color={color} label={label} />;
};
