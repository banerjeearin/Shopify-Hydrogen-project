/**
 * ParallaxCard Component
 * Creates a 3D parallax effect on mouse hover
 * Adds depth and interactivity to card elements
 */

import { useRef, useState, MouseEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ParallaxCardProps {
  children: ReactNode;
  /** Intensity of the parallax effect (0-1) */
  intensity?: number;
  /** Enable glare effect */
  glare?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ParallaxCard({
  children,
  intensity = 0.5,
  glare = true,
  className = ''
}: ParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation angles (constrained for subtlety)
    const maxRotation = 15 * intensity;
    const rotX = -(mouseY / (rect.height / 2)) * maxRotation;
    const rotY = (mouseX / (rect.width / 2)) * maxRotation;

    setRotateX(rotX);
    setRotateY(rotY);

    // Calculate glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      animate={{
        rotateX,
        rotateY
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Content */}
      <div
        style={{
          transform: 'translateZ(20px)'
        }}
      >
        {children}
      </div>

      {/* Glare effect */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)`,
            transform: 'translateZ(1px)'
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * ParallaxLayer Component
 * Individual layer with depth - use inside ParallaxCard
 */
interface ParallaxLayerProps {
  children: ReactNode;
  depth?: number;
  className?: string;
}

export function ParallaxLayer({
  children,
  depth = 0,
  className = ''
}: ParallaxLayerProps) {
  return (
    <div
      className={className}
      style={{
        transform: `translateZ(${depth}px)`
      }}
    >
      {children}
    </div>
  );
}
