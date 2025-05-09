import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

const LottiePlayer = ({ path }: { path: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: containerRef.current!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path,
    });

    return () => animation.destroy(); // cleanup
  }, [path]);

  return <div ref={containerRef} style={{ width: 400, height: 500 }} />;
};

export default LottiePlayer;
