import { cn } from '@/utilities/cn';
import { cva, VariantProps } from 'class-variance-authority';

const pillVariants = cva('px-2 py-0.5 rounded-lg text-xs font-medium text-nowrap', {
  variants: {
    color: {
      default: '',
      glacial: '',
      'sea-green': '',
      cerulean: '',
      sushi: '',
      'trendy-pink': '',
      'tahiti-gold': '',
      raspberry: '',
      primary: '',
      accent: '',
      neutral: '',
    },
    shade: {
      default: 'text-foreground',
      tint: 'text-foreground',
      midtone: 'text-foreground',
      shade: 'text-foreground-inverted',
    },
  },
  compoundVariants: [
    {
      color: 'glacial',
      shade: ['tint', 'default'],
      class: 'bg-glacial-300',
    },
    {
      color: 'glacial',
      shade: ['midtone'],
      class: 'bg-glacial-500',
    },
    {
      color: 'glacial',
      shade: ['shade'],
      class: 'bg-glacial-700',
    },
    {
      color: 'sea-green',
      shade: ['tint', 'default'],
      class: 'bg-sea-green-300',
    },
    {
      color: 'sea-green',
      shade: ['midtone'],
      class: 'bg-sea-green-400',
    },
    {
      color: 'sea-green',
      shade: ['shade'],
      class: 'bg-sea-green-700',
    },
    {
      color: 'cerulean',
      shade: ['tint', 'default'],
      class: 'bg-cerulean-300',
    },
    {
      color: 'cerulean',
      shade: ['midtone'],
      class: 'bg-cerulean-400',
    },
    {
      color: 'cerulean',
      shade: ['shade'],
      class: 'bg-cerulean-700',
    },
    {
      color: 'sushi',
      shade: ['tint', 'default'],
      class: 'bg-sushi-300',
    },
    {
      color: 'sushi',
      shade: ['midtone'],
      class: 'bg-sushi-400',
    },
    {
      color: 'sushi',
      shade: ['shade'],
      class: 'bg-sushi-700',
    },
    {
      color: 'trendy-pink',
      shade: ['tint', 'default'],
      class: 'bg-trendy-pink-300',
    },
    {
      color: 'trendy-pink',
      shade: ['midtone'],
      class: 'bg-trendy-pink-400',
    },
    {
      color: 'trendy-pink',
      shade: ['shade'],
      class: 'bg-trendy-pink-700',
    },
    {
      color: 'tahiti-gold',
      shade: ['tint', 'default'],
      class: 'bg-tahiti-gold-300',
    },
    {
      color: 'tahiti-gold',
      shade: ['midtone'],
      class: 'bg-tahiti-gold-400',
    },
    {
      color: 'tahiti-gold',
      shade: ['shade'],
      class: 'bg-tahiti-gold-700',
    },
    {
      color: 'raspberry',
      shade: ['tint', 'default'],
      class: 'bg-raspberry-300',
    },
    {
      color: 'raspberry',
      shade: ['midtone'],
      class: 'bg-raspberry-400',
    },
    {
      color: 'raspberry',
      shade: ['shade'],
      class: 'bg-raspberry-700',
    },
    {
      color: 'primary',
      shade: ['tint', 'default'],
      class: 'bg-njsig-tint',
    },
    {
      color: 'primary',
      shade: ['midtone'],
      class: 'bg-njsig-midtone',
    },
    {
      color: 'primary',
      shade: ['shade'],
      class: 'bg-njsig-shade',
    },
    {
      color: 'accent',
      shade: ['tint', 'default'],
      class: 'bg-njsig-accent-tint',
    },
    {
      color: 'accent',
      shade: ['midtone'],
      class: 'bg-njsig-accent-midtone',
    },
    {
      color: 'accent',
      shade: ['shade'],
      class: 'bg-njsig-accent-shade',
    },
    {
      color: ['neutral', 'default'],
      shade: ['tint', 'default'],
      class: 'bg-njsig-neutral-tint',
    },
    {
      color: ['neutral', 'default'],
      shade: ['midtone'],
      class: 'bg-njsig-neutral-midtone',
    },
    {
      color: ['neutral', 'default'],
      shade: ['shade'],
      class: 'bg-njsig-neutral-shade',
    },
  ],
  defaultVariants: {
    color: 'default',
    shade: 'default',
  },
});

export type PillVariantProps = VariantProps<typeof pillVariants>;

export type PillProps = PillVariantProps & {
  label: string;
  className?: string;
};

export const Pill: React.FC<PillProps> = ({ color, shade, label, className }) => {
  return <span className={cn(pillVariants({ color, shade }), className)}>{label}</span>;
};
