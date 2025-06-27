'use client';

import { cn } from '@/utilities/cn';
import { getMediaUrl } from '@/utilities/getMediaUrl';
import { useRef } from 'react';
import { MediaProps } from '../types';

type VideoBooleanProps = {
  autoPlay?: boolean;
  controls?: boolean;
  controlslist?: string;
  loop?: boolean;
};

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { videoClassName, resource, autoPlay, controls, controlslist, loop, onClick } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  // const [showFallback, setShowFallback] = useState<boolean>();

  // useEffect(() => {
  //   const { current: video } = videoRef;

  //   if (video) {
  //     video.addEventListener('suspend', () => {
  //       setShowFallback(true);
  //       console.warn('Video was suspended, showing fallback image');
  //     });
  //   }
  // }, [videoRef]);

  if (resource && typeof resource === 'object') {
    const { filename } = resource;

    // The autoPlay & controls attribute are always set to true if the prop is included
    // in the video tag. By setting the props in a separate object that is empty by default,
    // we can easily add the autoPlay property with a value when needed and spread it into the video tag.
    const boolProps: VideoBooleanProps = {};

    if (autoPlay) {
      boolProps.autoPlay = true;
    }

    if (controls) {
      boolProps.controls = true;

      if (controlslist) {
        boolProps.controlslist = controlslist.join(' ');
      } else {
        boolProps.controlslist = 'nodownload';
      }
    }

    if (loop) {
      boolProps.loop = true;
    }

    return (
      <video
        {...boolProps}
        className={cn(videoClassName)}
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={getMediaUrl(`/media/${filename}`)} />
      </video>
    );
  }

  return null;
};
