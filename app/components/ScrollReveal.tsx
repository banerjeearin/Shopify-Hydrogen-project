import {ReactNode, useRef} from 'react';
import {motion, useInView} from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {once: true, margin: '-100px'});

  const directions = {
    up: {y: 50, x: 0},
    down: {y: -50, x: 0},
    left: {x: 50, y: 0},
    right: {x: -50, y: 0},
  };

  const {x, y} = directions[direction];

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, x, y}}
      animate={isInView ? {opacity: 1, x: 0, y: 0} : {opacity: 0, x, y}}
      transition={{duration: 0.6, delay}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

