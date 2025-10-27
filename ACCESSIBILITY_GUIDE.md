# Accessibility & Toast Notifications

This document provides examples and usage instructions for the newly added accessibility features, focus states, and toast notification system.

## Table of Contents
- [Toast Notifications](#toast-notifications)
- [Button Component](#button-component)
- [Dropdown Component](#dropdown-component)
- [Focus Management Hooks](#focus-management-hooks)
- [Accessibility Utilities](#accessibility-utilities)

## Toast Notifications

### Basic Usage

```tsx
import { useToast } from '../contexts/ToastContext';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Profile updated successfully!');
  };

  const handleError = () => {
    toast.error('Failed to save changes');
  };

  const handleWarning = () => {
    toast.warning('Your session will expire in 5 minutes');
  };

  const handleInfo = () => {
    toast.info('New feature available!');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}
```

### Custom Duration

```tsx
// Toast will stay for 3 seconds (default is 5 seconds)
toast.success('Quick message', 3000);

// Toast will stay indefinitely (manual dismiss only)
toast.error('Critical error', 0);
```

### Advanced Usage

```tsx
const toast = useToast();

// Manual control
toast.addToast('Custom message', 'info', 7000);

// Remove specific toast
toast.removeToast(toastId);

// Access all toasts
console.log(toast.toasts);
```

## Button Component

### Basic Usage

```tsx
import Button from '../components/common/Button';

function MyForm() {
  return (
    <div>
      {/* Primary button */}
      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>

      {/* Secondary button */}
      <Button variant="secondary" onClick={handleCancel}>
        Cancel
      </Button>

      {/* Danger button */}
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}
```

### Sizes

```tsx
<Button size="small">Small Button</Button>
<Button size="medium">Medium Button</Button>
<Button size="large">Large Button</Button>
```

### Loading State

```tsx
const [isLoading, setIsLoading] = useState(false);

<Button isLoading={isLoading} onClick={handleAsync}>
  Save Changes
</Button>
```

### Accessibility Props

```tsx
<Button 
  ariaLabel="Close dialog"
  ariaDescription="Closes the settings dialog without saving"
  onClick={handleClose}
>
  <X size={20} />
</Button>
```

### Full Example

```tsx
function UserProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProfile();
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      variant="primary"
      size="large"
      isLoading={isSaving}
      onClick={handleSave}
      ariaLabel="Save profile changes"
    >
      Save Profile
    </Button>
  );
}
```

## Dropdown Component

### Basic Usage

```tsx
import Dropdown from '../components/common/Dropdown';
import { Settings, User, LogOut } from 'lucide-react';

function UserMenu() {
  const items = [
    {
      label: 'Profile',
      onClick: () => navigate('/profile'),
      icon: <User size={16} />,
    },
    {
      label: 'Settings',
      onClick: () => navigate('/settings'),
      icon: <Settings size={16} />,
    },
    {
      label: 'Logout',
      onClick: handleLogout,
      icon: <LogOut size={16} />,
      danger: true,
    },
  ];

  return (
    <Dropdown
      trigger={<button>Open Menu</button>}
      items={items}
      ariaLabel="User menu"
    />
  );
}
```

### Keyboard Navigation

The dropdown supports full keyboard navigation:
- **Enter/Space/ArrowDown**: Open the dropdown
- **ArrowDown/ArrowUp**: Navigate between items
- **Home/End**: Jump to first/last item
- **Enter**: Select the focused item
- **Escape**: Close the dropdown

### Alignment

```tsx
<Dropdown
  trigger={<button>Menu</button>}
  items={items}
  align="right" // or "left" (default)
/>
```

### Disabled Items

```tsx
const items = [
  {
    label: 'Active Item',
    onClick: () => console.log('Clicked'),
  },
  {
    label: 'Disabled Item',
    onClick: () => console.log('Will not fire'),
    disabled: true,
  },
];
```

## Focus Management Hooks

### useFocusTrap

Traps focus within a container (useful for modals and dialogs):

```tsx
import { useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

function Modal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, isOpen);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      <h2>Modal Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### useKeyboardNavigation

Manages keyboard navigation in lists and menus:

```tsx
import { useRef } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

function List() {
  const listRef = useRef<HTMLDivElement>(null);
  const { handleKeyDown } = useKeyboardNavigation({
    containerRef: listRef,
    onEscape: () => console.log('Escape pressed'),
    onEnter: (index) => console.log(`Item ${index} selected`),
    loop: true,
  });

  return (
    <div ref={listRef} onKeyDown={handleKeyDown} role="menu">
      <button role="menuitem">Item 1</button>
      <button role="menuitem">Item 2</button>
      <button role="menuitem">Item 3</button>
    </div>
  );
}
```

## Accessibility Utilities

### Screen Reader Announcements

```tsx
import { announceToScreenReader } from '../utils/accessibility';

function MyComponent() {
  const handleAction = () => {
    // Do something
    announceToScreenReader('Action completed successfully', 'polite');
    // Use 'assertive' for critical announcements
  };
}
```

### Focus Manager

```tsx
import { FocusManager } from '../utils/accessibility';

function MyComponent() {
  const focusManager = new FocusManager();

  const openModal = () => {
    focusManager.saveFocus(); // Save current focus
    // Open modal
  };

  const closeModal = () => {
    // Close modal
    focusManager.restoreFocus(); // Return focus to previous element
  };
}
```

### Get Focusable Elements

```tsx
import { getFocusableElements } from '../utils/accessibility';

const container = document.getElementById('my-container');
const focusableElements = getFocusableElements(container);
focusableElements[0]?.focus();
```

### Unique IDs for ARIA

```tsx
import { generateUniqueId } from '../utils/accessibility';

function FormField() {
  const id = generateUniqueId('form-field');
  const descriptionId = generateUniqueId('description');

  return (
    <div>
      <label htmlFor={id}>Username</label>
      <input 
        id={id} 
        aria-describedby={descriptionId}
      />
      <p id={descriptionId}>Enter your username</p>
    </div>
  );
}
```

### Check for Reduced Motion

```tsx
import { prefersReducedMotion } from '../utils/accessibility';

function AnimatedComponent() {
  const shouldAnimate = !prefersReducedMotion();

  return (
    <div className={shouldAnimate ? 'animate' : ''}>
      Content
    </div>
  );
}
```

## CSS Accessibility Classes

### Screen Reader Only

```tsx
// Visible to screen readers but hidden visually
<span className="sr-only">Loading...</span>
```

### Focus Visible

```tsx
// Enhanced focus states
<button className="focus-visible">Click me</button>
```

### Touch Target

```tsx
// Ensures minimum 44x44px touch target
<button className="touch-target">
  <X size={16} />
</button>
```

### Skip Link

```tsx
// Add at the top of your app for keyboard navigation
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Your content */}
</main>
```

## Best Practices

### 1. Always provide ARIA labels for icon-only buttons

```tsx
// ❌ Bad
<button onClick={handleClose}>
  <X size={20} />
</button>

// ✅ Good
<Button onClick={handleClose} ariaLabel="Close dialog">
  <X size={20} />
</Button>
```

### 2. Use toast notifications for feedback

```tsx
// ✅ Good
const handleDelete = async () => {
  try {
    await deleteItem();
    toast.success('Item deleted successfully');
  } catch (error) {
    toast.error('Failed to delete item');
  }
};
```

### 3. Manage focus in modals and dialogs

```tsx
// ✅ Good
function Dialog({ isOpen, onClose }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, isOpen);

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true">
      {/* Content */}
    </div>
  );
}
```

### 4. Provide keyboard navigation

```tsx
// ✅ All interactive elements should be keyboard accessible
<Dropdown
  trigger={<button>Menu</button>}
  items={items}
  ariaLabel="Main navigation menu"
/>
```

### 5. Use semantic HTML

```tsx
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<Button onClick={handleClick}>Click me</Button>
```

## WCAG Compliance

All components follow WCAG 2.1 Level AA standards:

- ✅ Keyboard Navigation
- ✅ Screen Reader Support
- ✅ Focus Management
- ✅ ARIA Attributes
- ✅ Color Contrast
- ✅ Touch Target Sizes (44x44px minimum)
- ✅ Reduced Motion Support
- ✅ High Contrast Mode Support

## Testing

### Keyboard Testing

1. Use Tab to navigate through interactive elements
2. Use Enter/Space to activate buttons
3. Use Arrow keys in dropdowns and lists
4. Use Escape to close modals and dropdowns

### Screen Reader Testing

Test with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### Automated Testing

```bash
# Run accessibility linting
npm run lint

# Check for common accessibility issues
npm run test
```

