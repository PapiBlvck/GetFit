import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import { Settings, User, LogOut, Bell, Heart, Info } from 'lucide-react';

/**
 * Demo component showcasing accessibility features and toast notifications
 * This component demonstrates:
 * - Toast notifications (success, error, warning, info)
 * - Accessible button components with focus states
 * - Accessible dropdown with keyboard navigation
 * - Proper ARIA attributes
 */
const AccessibilityDemo: React.FC = () => {
  const toast = useToast();
  const [counter, setCounter] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSuccess = () => {
    toast.success('Operation completed successfully! 🎉');
  };

  const handleError = () => {
    toast.error('Oops! Something went wrong. Please try again.');
  };

  const handleWarning = () => {
    toast.warning('Warning: This action requires confirmation.');
  };

  const handleInfo = () => {
    toast.info('Did you know? You can use keyboard navigation throughout this app!');
  };

  const handleAsyncOperation = async () => {
    setIsProcessing(true);
    toast.info('Processing your request...');
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    toast.success('Request processed successfully!');
    setCounter(prev => prev + 1);
  };

  const dropdownItems = [
    {
      label: 'Profile',
      onClick: () => toast.info('Navigating to profile...'),
      icon: <User size={16} />,
    },
    {
      label: 'Settings',
      onClick: () => toast.info('Opening settings...'),
      icon: <Settings size={16} />,
    },
    {
      label: 'Notifications',
      onClick: () => toast.info('Checking notifications...'),
      icon: <Bell size={16} />,
      disabled: false,
    },
    {
      label: 'Logout',
      onClick: () => toast.warning('Are you sure you want to logout?'),
      icon: <LogOut size={16} />,
      danger: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Accessibility & Toast Demo
        </h1>
        <p className="text-gray-400 text-lg">
          Explore accessible components with keyboard navigation and toast notifications
        </p>
      </header>

      {/* Toast Notifications Section */}
      <section className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="text-blue-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Toast Notifications</h2>
        </div>
        
        <p className="text-gray-300 mb-4">
          Click the buttons below to trigger different types of toast notifications:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="primary" 
            onClick={handleSuccess}
            ariaLabel="Show success notification"
          >
            Success
          </Button>
          
          <Button 
            variant="danger" 
            onClick={handleError}
            ariaLabel="Show error notification"
          >
            Error
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleWarning}
            ariaLabel="Show warning notification"
          >
            Warning
          </Button>
          
          <Button 
            variant="primary" 
            onClick={handleInfo}
            ariaLabel="Show info notification"
          >
            Info
          </Button>
        </div>
      </section>

      {/* Button Variants Section */}
      <section className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-red-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Button Variants & States</h2>
        </div>

        <div className="space-y-6">
          {/* Sizes */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="small" variant="primary">
                Small
              </Button>
              <Button size="medium" variant="primary">
                Medium
              </Button>
              <Button size="large" variant="primary">
                Large
              </Button>
            </div>
          </div>

          {/* Variants */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">States</h3>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="primary" 
                isLoading={isProcessing}
                onClick={handleAsyncOperation}
              >
                Process Request {counter > 0 && `(${counter})`}
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dropdown Section */}
      <section className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="text-green-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Accessible Dropdown</h2>
        </div>

        <p className="text-gray-300 mb-4">
          Try keyboard navigation: Tab to focus, Enter/Space to open, Arrow keys to navigate, Escape to close
        </p>

        <div className="flex gap-4">
          <Dropdown
            trigger={
              <Button variant="primary">
                User Menu
              </Button>
            }
            items={dropdownItems}
            ariaLabel="User account menu"
            align="left"
          />

          <Dropdown
            trigger={
              <Button variant="secondary">
                Right Aligned
              </Button>
            }
            items={dropdownItems}
            ariaLabel="Right aligned menu"
            align="right"
          />
        </div>
      </section>

      {/* Keyboard Navigation Guide */}
      <section className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Info className="text-yellow-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Keyboard Navigation</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">General</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li><kbd className="px-2 py-1 bg-gray-600 rounded">Tab</kbd> - Navigate forward</li>
              <li><kbd className="px-2 py-1 bg-gray-600 rounded">Shift + Tab</kbd> - Navigate backward</li>
              <li><kbd className="px-2 py-1 bg-gray-600 rounded">Enter/Space</kbd> - Activate button</li>
              <li><kbd className="px-2 py-1 bg-gray-600 rounded">Escape</kbd> - Close dropdown/modal</li>
            </ul>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Dropdown</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li><kbd className="px-2 py-1 bg-gray-600 rounded">↑ ↓</kbd> - Navigate items</li>
              <li><kbd className="px-2 py-1 bg-gray-600 rounded">Home</kbd> - First item</li>
              <li><kbd className="px-2 py-1 bg-gray-600 rounded">End</kbd> - Last item</li>
              <li><kbd className="px-2 py-1 bg-gray-600 rounded">Enter</kbd> - Select item</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Accessibility Features</h2>
        
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span><strong>WCAG 2.1 Level AA Compliant:</strong> All components follow accessibility guidelines</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span><strong>Keyboard Navigation:</strong> Full keyboard support for all interactive elements</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span><strong>Screen Reader Support:</strong> Proper ARIA labels and live regions</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span><strong>Focus Management:</strong> Visible focus indicators and focus trapping in modals</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span><strong>Reduced Motion:</strong> Respects user's motion preferences</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span><strong>High Contrast Mode:</strong> Adjusts for high contrast preferences</span>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm">
        <p>Check the console for screen reader announcements and focus events</p>
      </footer>
    </div>
  );
};

export default AccessibilityDemo;

