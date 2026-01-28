import {useState, useEffect} from 'react';

interface Responsive3DViewerProps {
  desktopComponent: React.ReactNode;
  mobileComponent: React.ReactNode;
}

export default function Responsive3DViewer({
  desktopComponent,
  mobileComponent,
}: Responsive3DViewerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return <div className="aspect-square bg-neutral-100 rounded-lg" />;
  }

  return (
    <div className="w-full">
      <div className="hidden md:block">{desktopComponent}</div>
      <div className="block md:hidden">{mobileComponent}</div>
    </div>
  );
}

