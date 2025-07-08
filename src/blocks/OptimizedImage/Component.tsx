import { Media } from '@/components/Media';
import { OptimizedImageBlock as OptimizedImageBlockProps } from '@/payload-types';

export const OptimizedImageBlock: React.FC<OptimizedImageBlockProps> = ({
  image,
  height,
  width,
  priority,
  placeholder,
}) => {
  return (
    <Media
      resource={image}
      height={height}
      width={width}
      priority={priority}
      placeholder={placeholder ? 'blur' : 'empty'}
    />
  );
};
