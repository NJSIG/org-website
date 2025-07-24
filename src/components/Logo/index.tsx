import { cn } from '@/utilities/cn';
import Image from 'next/image';

interface Props {
  style: 'full' | 'wordmark';
  theme?: 'light' | 'dark' | null;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: 'auto' | 'high' | 'low';
}

const aspectRatio = {
  full: {
    width: 284,
    height: 112,
    ratio: 0.39,
  },
  wordmark: {
    width: 177,
    height: 56,
    ratio: 0.32,
  },
};

export const Logo = (props: Props) => {
  const theme = props.theme || 'dark';
  const loading = props.loading || 'lazy';
  const priority = props.priority || 'low';

  let width = props.width;
  let height = props.height;

  switch (true) {
    // Only width is set
    case width !== undefined && height === undefined:
      height = Math.round(width * aspectRatio[props.style].ratio);
      break;
    // Only height is set
    case height !== undefined && width === undefined:
      width = Math.round(height * aspectRatio[props.style].ratio);
      break;
    // Neither are set
    case width === undefined && height === undefined:
      width = aspectRatio[props.style].width;
      height = aspectRatio[props.style].height;
      break;
  }

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
      unoptimized
    />
  );
};
