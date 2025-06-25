import { cn } from '@/utilities/cn';
import { Fragment } from 'react';
import { ImageMedia } from './ImageMedia';
import { MediaProps } from './types';
import { VideoMedia } from './VideoMedia';

export const Media: React.FC<MediaProps> = (props) => {
  const { className: classNameFromProps, htmlElement = 'div', resource } = props;

  const Tag = htmlElement || Fragment;
  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video');
  const className = cn('cms-media', classNameFromProps);

  return (
    <Tag {...(htmlElement !== null ? { className } : {})}>
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  );
};
