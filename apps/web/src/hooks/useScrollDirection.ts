import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down';

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: ScrollDirection;
}

/**
 * Custom hook to detect scroll direction
 * Returns true when scrolling up (navbar should be visible)
 * Returns false when scrolling down (navbar should be hidden)
 */
export const useScrollDirection = (options: UseScrollDirectionOptions = {}): boolean => {
  const { threshold = 10, initialDirection = 'up' } = options;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // Only update if we've scrolled past the threshold
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      // Show navbar when at the top of the page
      if (scrollY < 50) {
        setIsVisible(true);
      } 
      // Show navbar when scrolling up
      else if (scrollY < lastScrollY) {
        setIsVisible(true);
      } 
      // Hide navbar when scrolling down
      else if (scrollY > lastScrollY) {
        setIsVisible(false);
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return isVisible;
};

