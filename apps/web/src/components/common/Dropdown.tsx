import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  /** Accessible label for the dropdown menu */
  ariaLabel?: string;
  /** Alignment of dropdown menu */
  align?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({ 
  trigger, 
  items, 
  ariaLabel = 'Dropdown menu',
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setFocusedIndex(-1);
        // Return focus to trigger
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Focus management when dropdown opens
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstButton = menuRef.current.querySelector('button:not([disabled])') as HTMLButtonElement;
      firstButton?.focus();
      setFocusedIndex(0);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const enabledItems = items.filter(item => !item.disabled);
    const currentIndex = focusedIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0;
        setFocusedIndex(nextIndex);
        (menuRef.current?.querySelectorAll('button:not([disabled])')[nextIndex] as HTMLButtonElement)?.focus();
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1;
        setFocusedIndex(prevIndex);
        (menuRef.current?.querySelectorAll('button:not([disabled])')[prevIndex] as HTMLButtonElement)?.focus();
        break;
        
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        (menuRef.current?.querySelector('button:not([disabled])') as HTMLButtonElement)?.focus();
        break;
        
      case 'End':
        event.preventDefault();
        const lastIndex = enabledItems.length - 1;
        setFocusedIndex(lastIndex);
        const buttons = menuRef.current?.querySelectorAll('button:not([disabled])');
        (buttons?.[buttons.length - 1] as HTMLButtonElement)?.focus();
        break;
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
      setFocusedIndex(-1);
      triggerRef.current?.focus();
    }
  };

  const alignmentClasses = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div 
        ref={triggerRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        tabIndex={0}
        className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-all"
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-trigger"
          className={`absolute ${alignmentClasses} mt-2 min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
        >
          {items.map((item, index) => (
            <button
              key={index}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => handleItemClick(item)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
                ${item.disabled 
                  ? 'opacity-50 cursor-not-allowed text-gray-400' 
                  : item.danger
                    ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }
              `}
              aria-disabled={item.disabled}
            >
              {item.icon && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

