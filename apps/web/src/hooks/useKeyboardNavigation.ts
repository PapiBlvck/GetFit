import { useCallback, RefObject } from 'react';

interface UseKeyboardNavigationOptions {
  containerRef: RefObject<HTMLElement>;
  onEscape?: () => void;
  onEnter?: (index: number) => void;
  selector?: string;
  loop?: boolean;
}

/**
 * Hook for managing keyboard navigation in lists and menus
 * Supports Arrow keys, Home, End, Enter, and Escape
 */
export const useKeyboardNavigation = ({
  containerRef,
  onEscape,
  onEnter,
  selector = 'button:not([disabled]), [role="menuitem"]:not([disabled]), a:not([disabled])',
  loop = true,
}: UseKeyboardNavigationOptions) => {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!containerRef.current) return;

      const items = Array.from(
        containerRef.current.querySelectorAll(selector)
      ) as HTMLElement[];

      if (items.length === 0) return;

      const currentIndex = items.findIndex(
        (item) => item === document.activeElement
      );

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex < items.length - 1) {
            items[currentIndex + 1]?.focus();
          } else if (loop) {
            items[0]?.focus();
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          if (currentIndex > 0) {
            items[currentIndex - 1]?.focus();
          } else if (loop) {
            items[items.length - 1]?.focus();
          }
          break;

        case 'Home':
          event.preventDefault();
          items[0]?.focus();
          break;

        case 'End':
          event.preventDefault();
          items[items.length - 1]?.focus();
          break;

        case 'Enter':
          if (onEnter && currentIndex !== -1) {
            event.preventDefault();
            onEnter(currentIndex);
          }
          break;

        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
      }
    },
    [containerRef, onEscape, onEnter, selector, loop]
  );

  return { handleKeyDown };
};


