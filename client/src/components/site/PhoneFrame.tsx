import { forwardRef, type CSSProperties } from 'react';

interface Props {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  className?: string;
  style?: CSSProperties;
  onEnded?: () => void;
}

/** CSS phone frame around one of our 1280×2800 screen recordings. Decorative. */
const PhoneFrame = forwardRef<HTMLVideoElement, Props>(function PhoneFrame(
  { src, poster, autoPlay, loop, preload = 'none', className = '', style, onEnded },
  ref,
) {
  return (
    <div className={`phone ${className}`} style={style} aria-hidden="true">
      <div className="phone-screen">
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          playsInline
          autoPlay={autoPlay}
          loop={loop}
          preload={preload}
          onEnded={onEnded}
          disablePictureInPicture
        />
      </div>
    </div>
  );
});

export default PhoneFrame;
