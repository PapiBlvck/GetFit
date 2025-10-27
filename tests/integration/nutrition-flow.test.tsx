import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { ToastProvider } from '@contexts/ToastContext';
import Nutrition from '@pages/Nutrition';

// Mock Firestore hooks
const mockAddMeal = vi.fn();
const mockUpdateMeal = vi.fn();
const mockDeleteMeal = vi.fn();

vi.mock('@hooks/useFirestore', () => ({
  useMeals: () => ({
    meals: [
      {
        id: 'meal-1',
        name: 'Test Meal',
        calories: 500,
        protein: 30,
        carbs: 50,
        fats: 20,
        mealType: 'breakfast',
        date: '2024-01-15',
      },
    ],
    addMeal: mockAddMeal,
    updateMeal: mockUpdateMeal,
    deleteMeal: mockDeleteMeal,
    loading: false,
  }),
}));

vi.mock('@contexts/AuthContext', () => ({
  AuthProvider: ({ children }: any) => children,
  useAuth: () => ({
    currentUser: { uid: 'test-user-123', email: 'test@example.com' },
    loading: false,
  }),
}));

describe('Nutrition Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display existing meals', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <Nutrition />
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByText('Test Meal')).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it('should add a new meal', async () => {
    mockAddMeal.mockResolvedValue({ id: 'new-meal-123' });

    render(
      <ToastProvider>
        <AuthProvider>
          <Nutrition />
        </AuthProvider>
      </ToastProvider>
    );

    // Click "Add Meal" button
    const addButton = screen.getByText(/add meal/i);
    fireEvent.click(addButton);

    // Fill in meal form
    const nameInput = screen.getByLabelText(/meal name/i);
    const caloriesInput = screen.getByLabelText(/calories/i);
    
    fireEvent.change(nameInput, { target: { value: 'New Meal' } });
    fireEvent.change(caloriesInput, { target: { value: '600' } });

    // Submit form
    const submitButton = screen.getByText(/save/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddMeal).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Meal',
          calories: 600,
        })
      );
    });
  });

  it('should update an existing meal', async () => {
    mockUpdateMeal.mockResolvedValue(undefined);

    render(
      <ToastProvider>
        <AuthProvider>
          <Nutrition />
        </AuthProvider>
      </ToastProvider>
    );

    // Click edit button
    const editButton = screen.getByLabelText(/edit/i);
    fireEvent.click(editButton);

    // Modify meal
    const caloriesInput = screen.getByLabelText(/calories/i);
    fireEvent.change(caloriesInput, { target: { value: '550' } });

    // Save changes
    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateMeal).toHaveBeenCalledWith(
        'meal-1',
        expect.objectContaining({
          calories: 550,
        })
      );
    });
  });

  it('should delete a meal', async () => {
    mockDeleteMeal.mockResolvedValue(undefined);

    render(
      <ToastProvider>
        <AuthProvider>
          <Nutrition />
        </AuthProvider>
      </ToastProvider>
    );

    // Click delete button
    const deleteButton = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteMeal).toHaveBeenCalledWith('meal-1');
    });
  });

  it('should calculate daily totals', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <Nutrition />
        </AuthProvider>
      </ToastProvider>
    );

    // Check if totals are displayed
    expect(screen.getByText(/total calories/i)).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument(); // Total from single meal
  });

  it('should filter meals by type', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <Nutrition />
        </AuthProvider>
      </ToastProvider>
    );

    // Click breakfast filter
    const breakfastFilter = screen.getByText(/breakfast/i);
    fireEvent.click(breakfastFilter);

    // Meal should still be visible (it's a breakfast meal)
    expect(screen.getByText('Test Meal')).toBeInTheDocument();
  });
});

