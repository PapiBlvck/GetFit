import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@components/common/Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByText('Disabled');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render with custom className', () => {
    render(<Button className="custom-class">Styled Button</Button>);
    
    const button = screen.getByText('Styled Button');
    expect(button).toHaveClass('custom-class');
  });

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    const secondaryButton = screen.getByText('Secondary');
    expect(secondaryButton).toHaveClass('bg-gray-200');
    expect(secondaryButton).toHaveClass('text-gray-800');
    
    rerender(<Button variant="danger">Danger</Button>);
    const dangerButton = screen.getByText('Danger');
    expect(dangerButton).toHaveClass('bg-red-600');
    expect(dangerButton).toHaveClass('text-white');
  });

  it('should render loading state', () => {
    render(<Button isLoading>Loading Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should support different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    const smallButton = screen.getByText('Small');
    expect(smallButton).toHaveClass('px-3');
    expect(smallButton).toHaveClass('py-1.5');
    expect(smallButton).toHaveClass('text-sm');
    
    rerender(<Button size="medium">Medium</Button>);
    const mediumButton = screen.getByText('Medium');
    expect(mediumButton).toHaveClass('px-4');
    expect(mediumButton).toHaveClass('py-2');
    expect(mediumButton).toHaveClass('text-base');
    
    rerender(<Button size="large">Large</Button>);
    const largeButton = screen.getByText('Large');
    expect(largeButton).toHaveClass('px-6');
    expect(largeButton).toHaveClass('py-3');
    expect(largeButton).toHaveClass('text-lg');
  });

  it('should apply custom className', () => {
    render(<Button className="my-custom-class">Custom</Button>);
    
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('my-custom-class');
    expect(button).toHaveClass('rounded-lg'); // Still has base classes
  });
});

