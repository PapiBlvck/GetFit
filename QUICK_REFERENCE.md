# 🚀 Quick Reference - UI/UX Features

## Toast Notifications

```typescript
import { useToast } from '../contexts/ToastContext';

const toast = useToast();

// Quick usage
toast.success('Done!');
toast.error('Failed!');
toast.warning('Be careful!');
toast.info('Here's a tip!');

// With custom duration (milliseconds)
toast.success('Saved!', 3000);  // 3 seconds
toast.warning('Important!', 10000);  // 10 seconds
toast.info('Click to dismiss', 0);  // Never auto-dismiss
```

---

## Design Tokens

### Spacing
```css
padding: var(--space-xs);    /* 4px */
padding: var(--space-sm);    /* 8px */
padding: var(--space-md);    /* 12px */
padding: var(--space-lg);    /* 16px */
padding: var(--space-xl);    /* 24px */
padding: var(--space-2xl);   /* 32px */
padding: var(--space-3xl);   /* 48px */
```

### Typography
```css
font-size: var(--text-xs);    /* 12px */
font-size: var(--text-sm);    /* 14px */
font-size: var(--text-base);  /* 16px */
font-size: var(--text-lg);    /* 18px */
font-size: var(--text-xl);    /* 20px */
font-size: var(--text-2xl);   /* 24px */
font-size: var(--text-3xl);   /* 30px */
```

### Transitions
```css
transition: all var(--transition-fast);    /* 150ms */
transition: all var(--transition-base);    /* 300ms */
transition: all var(--transition-slow);    /* 500ms */
transition: all var(--transition-spring);  /* Spring effect */
```

### Shadows
```css
box-shadow: var(--shadow-sm);   /* Subtle */
box-shadow: var(--shadow-md);   /* Medium */
box-shadow: var(--shadow-lg);   /* Large */
box-shadow: var(--shadow-xl);   /* Extra large */
```

### Border Radius
```css
border-radius: var(--radius-sm);    /* 8px */
border-radius: var(--radius-md);    /* 12px */
border-radius: var(--radius-lg);    /* 16px */
border-radius: var(--radius-xl);    /* 20px */
border-radius: var(--radius-full);  /* 9999px - Pills */
```

---

## Accessibility

### Screen Reader Only
```tsx
<span className="sr-only">Hidden from view, read by screen readers</span>
```

### ARIA Labels
```tsx
<button aria-label="Delete item" onClick={handleDelete}>
  🗑️
</button>
```

### Focus States
```css
/* Automatic for all interactive elements! */
button:focus-visible {
  outline: 2px solid var(--primary-color);
  box-shadow: var(--focus-ring);
}
```

### Skip Navigation
```tsx
{/* Already in app - visible on Tab */}
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

---

## Colors

```css
--neon-cyan: #00fff5;      /* Primary */
--neon-purple: #bf00ff;    /* Secondary */
--neon-green: #39ff14;     /* Success */
--error-color: #ff3366;    /* Error */
--warning-color: #ff6b00;  /* Warning */
--info-color: #00d4ff;     /* Info */
```

---

## Common Patterns

### Button with Toast
```tsx
const handleSave = async () => {
  try {
    await saveData();
    toast.success('Saved successfully!');
  } catch (error) {
    toast.error('Failed to save');
  }
};
```

### Loading State
```tsx
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await doSomething();
    toast.success('Done!');
  } catch (error) {
    toast.error('Failed!');
  } finally {
    setLoading(false);
  }
};
```

### Form Validation
```tsx
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  
  if (!isValid) {
    toast.error('Please fill in all required fields');
    return;
  }
  
  toast.success('Form submitted!');
};
```

---

## 📱 Mobile Responsive

Toast notifications automatically adjust:
- **Desktop**: Top-right corner
- **Mobile**: Full-width at top

---

## ⌨️ Keyboard Shortcuts

- `Tab` - Next element
- `Shift + Tab` - Previous element
- `Enter/Space` - Activate button
- `Escape` - Close modal/menu
- `Arrow Keys` - Navigate lists

---

## 🎨 Status Colors

```tsx
// Success - Green glow
toast.success('Action completed!');

// Error - Red
toast.error('Something went wrong');

// Warning - Orange
toast.warning('Please be careful');

// Info - Cyan glow
toast.info('Here\'s a helpful tip!');
```

---

**For full documentation, see:**
- `ACCESSIBILITY_IMPLEMENTATION_GUIDE.md`
- `UI_UX_BEST_PRACTICES_IMPLEMENTATION.md`
- `IMPLEMENTATION_SUMMARY.md`

