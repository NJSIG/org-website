import { Media } from '@/components/Media';
import { OptimizedImageBlock as OptimizedImageBlockProps } from '@/payload-types';

export const OptimizedImageBlock: React.FC<OptimizedImageBlockProps> = ({
  image,
  height,
  width,
  priority,
}) => {
  return <Media resource={image} height={height} width={width} priority={priority} />;
};
