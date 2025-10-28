/**
 * Accessibility utility functions
 */

/**
 * Announces a message to screen readers using aria-live regions
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector));
};

/**
 * Save and restore focus when temporarily moving it
 */
export class FocusManager {
  private previouslyFocusedElement: HTMLElement | null = null;

  saveFocus() {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
  }

  restoreFocus() {
    if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }
}

/**
 * Check if an element is visible in the viewport
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Scroll element into view if not visible
 */
export const ensureElementIsVisible = (element: HTMLElement, options?: ScrollIntoViewOptions) => {
  if (!isElementVisible(element)) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      ...options,
    });
  }
};

/**
 * Create a unique ID for ARIA attributes
 */
let idCounter = 0;
export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${++idCounter}-${Date.now()}`;
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Add skip link for keyboard navigation
 */
export const addSkipLink = (targetId: string, linkText: string = 'Skip to main content') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = linkText;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  return skipLink;
};


