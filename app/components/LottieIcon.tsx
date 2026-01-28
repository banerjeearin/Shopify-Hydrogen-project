import Lottie from 'lottie-react';
import {useState, useEffect} from 'react';

interface LottieIconProps {
  animationData?: object;
  animationUrl?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieIcon({
  animationData,
  animationUrl,
  className = '',
  loop = true,
  autoplay = true,
}: LottieIconProps) {
  const [data, setData] = useState<object | null>(animationData || null);

  useEffect(() => {
    if (animationUrl && !animationData) {
      fetch(animationUrl)
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error('Failed to load Lottie animation:', err));
    }
  }, [animationUrl, animationData]);

  if (!data) {
    return <div className={className}>Loading...</div>;
  }

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
}

