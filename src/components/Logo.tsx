import { cn } from '@/utilities/cn';
import Image from 'next/image';

interface Props {
  style: 'full' | 'wordmark';
  theme?: 'light' | 'dark';
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: 'auto' | 'high' | 'low';
}

export const Logo = (props: Props) => {
  const theme = props.theme || 'dark';
  const width = props.width ?? (props.style === 'full' ? 284 : 177);
  const height = props.height ?? (props.style === 'full' ? 112 : 56);
  const loading = props.loading || 'lazy';
  const priority = props.priority || 'low';

  return (
    <Image
      alt="NJSIG Logo"
      width={width}
      height={height}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      src={`/assets/logo/${props.style}-${theme}.svg`}
      className={cn(props.className)}
    />
  );
};
