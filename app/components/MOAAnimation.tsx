import {useEffect, useState} from 'react';
import type {ComponentType} from 'react';

interface MOAAnimationProps {
  title?: string;
  description?: string;
}

/**
 * SSR-safe wrapper for MOAAnimation component
 * Dynamically imports the client-only Three.js component after mount
 * This prevents Three.js from being imported during SSR
 */
export default function MOAAnimation({
  title = 'Mechanism of Action',
  description = 'How our ingredients interact at a cellular level',
}: MOAAnimationProps) {
  const [ClientComponent, setClientComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    // Dynamically import the client-only component
    import('./MOAAnimation.client').then((module) => {
      setClientComponent(() => module.default);
    });
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">{title}</h2>
          <p className="text-xl text-neutral-600">{description}</p>
        </div>
        <div className="max-w-4xl mx-auto aspect-video bg-neutral-100 rounded-lg overflow-hidden">
          {ClientComponent ? (
            <ClientComponent />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              Loading 3D animation...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

