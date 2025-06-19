'use client';

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className 
}: FadeInProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction] 
      }}
      animate={isIntersecting ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.25, 0, 1]
      }}
    >
      {children}
    </motion.div>
  );
}