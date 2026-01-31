import {useEffect, useState} from 'react';
import type {ComponentType} from 'react';
import {motion} from 'framer-motion';

/**
 * SSR-safe wrapper for Hero component
 * Dynamically imports the client-only Three.js component after mount
 * This prevents Three.js from being imported during SSR
 */
export default function Hero() {
  const [ClientComponent, setClientComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    // Dynamically import the client-only component
    import('./Hero.client').then((module) => {
      setClientComponent(() => module.default);
    });
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-50 to-white">
      <div className="absolute inset-0 z-0">
        {ClientComponent ? (
          <ClientComponent />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-neutral-50 to-white" />
        )}
      </div>
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          className="text-6xl md:text-8xl font-serif font-bold text-neutral-900 mb-6"
        >
          Liimra
        </motion.h1>
        <motion.p
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.2}}
          className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-2xl mx-auto"
        >
          Premium healthcare products with innovative 3D experiences
        </motion.p>
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.4}}
        >
          <button className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-primary-700 transition-colors shadow-soft-lg">
            Explore Products
          </button>
        </motion.div>
      </div>
    </section>
  );
}
