import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Critical User Journeys
 * These tests verify the complete flow from user perspective
 */

test.describe('User Registration and Login Flow', () => {
  test('should complete registration flow', async ({ page }) => {
    await page.goto('/');

    // Click register
    await page.click('text=Sign Up');
    
    // Fill registration form
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to goal selection or dashboard
    await expect(page).toHaveURL(/\/(goals|dashboard)/);
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=/invalid|incorrect|wrong/i')).toBeVisible();
  });
});

test.describe('Workout Logging Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });

  test('should log a workout session', async ({ page }) => {
    // Navigate to workouts
    await page.click('text=Workouts');
    await expect(page).toHaveURL(/\/workouts/);
    
    // Start a workout
    await page.click('text=/start workout|begin workout/i');
    
    // Select workout type
    await page.click('text=Strength Training');
    
    // Add exercises
    await page.click('text=Add Exercise');
    await page.fill('input[placeholder*="exercise"]', 'Bench Press');
    await page.fill('input[placeholder*="sets"]', '3');
    await page.fill('input[placeholder*="reps"]', '10');
    await page.fill('input[placeholder*="weight"]', '80');
    
    // Complete workout
    await page.click('button:has-text("Complete Workout")');
    
    // Should show success message
    await expect(page.locator('text=/workout.*completed|saved/i')).toBeVisible();
    
    // Should show in history
    await expect(page.locator('text=Bench Press')).toBeVisible();
  });

  test('should update workout stats on dashboard', async ({ page }) => {
    // Check initial stats
    await page.goto('/dashboard');
    const initialWorkouts = await page.locator('[data-stat="workouts"]').textContent();
    
    // Complete a workout
    await page.click('text=Workouts');
    await page.click('button:has-text("Quick Workout")');
    await page.click('button:has-text("Complete")');
    
    // Go back to dashboard
    await page.goto('/dashboard');
    
    // Stats should be updated
    const updatedWorkouts = await page.locator('[data-stat="workouts"]').textContent();
    expect(Number(updatedWorkouts)).toBeGreaterThan(Number(initialWorkouts));
  });
});

test.describe('Nutrition Tracking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });

  test('should add a meal', async ({ page }) => {
    await page.click('text=Nutrition');
    await expect(page).toHaveURL(/\/nutrition/);
    
    // Add meal
    await page.click('button:has-text("Add Meal")');
    await page.fill('input[name="name"]', 'Grilled Chicken Salad');
    await page.fill('input[name="calories"]', '450');
    await page.fill('input[name="protein"]', '35');
    await page.fill('input[name="carbs"]', '30');
    await page.fill('input[name="fats"]', '18');
    await page.selectOption('select[name="mealType"]', 'lunch');
    
    await page.click('button[type="submit"]');
    
    // Should see meal in list
    await expect(page.locator('text=Grilled Chicken Salad')).toBeVisible();
    await expect(page.locator('text=450')).toBeVisible();
  });

  test('should show calorie total', async ({ page }) => {
    await page.goto('/nutrition');
    
    // Check that totals are displayed
    await expect(page.locator('text=/total calories/i')).toBeVisible();
    await expect(page.locator('[data-testid="total-calories"]')).toHaveText(/\d+/);
  });
});

test.describe('Goal Completion and Celebration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });

  test('should trigger celebration when all goals completed', async ({ page }) => {
    // Complete water goal
    await page.click('button:has-text("Add 250ml")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Add 250ml")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Add 250ml")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Add 250ml")');
    
    // Complete sleep goal
    await page.click('button:has-text("Log Sleep")');
    await page.fill('input[type="text"]', '8');
    await page.keyboard.press('Enter');
    
    // Complete steps goal (use test button)
    await page.click('button:has-text("🎉 Test")');
    
    // Should see celebration
    await expect(page.locator('text=/all goals completed/i')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.confetti-particle')).toHaveCount(100, { timeout: 3000 });
  });

  test('should show checkmarks on completed goals', async ({ page }) => {
    // Complete water goal
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("Add 250ml")');
      await page.waitForTimeout(300);
    }
    
    // Should see checkmark
    await expect(page.locator('#water-checkmark .goal-completed-checkmark')).toBeVisible();
  });
});

test.describe('Dashboard Stats Display', () => {
  test('should display all stat cards', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    
    // Check all stats are present
    await expect(page.locator('text=Calories Burned')).toBeVisible();
    await expect(page.locator('text=Steps')).toBeVisible();
    await expect(page.locator('text=Workouts Done')).toBeVisible();
    await expect(page.locator('text=Days Active')).toBeVisible();
    
    // Check stat values are displayed
    await expect(page.locator('[data-stat="calories"]')).toBeVisible();
    await expect(page.locator('[data-stat="steps"]')).toBeVisible();
    await expect(page.locator('[data-stat="workouts"]')).toBeVisible();
    await expect(page.locator('[data-stat="streak"]')).toBeVisible();
  });

  test('should open detailed view when clicking stats', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click calories stat
    await page.click('[data-stat="calories"]');
    await expect(page.locator('text=/calories burned.*detail/i')).toBeVisible();
    
    // Close and click steps
    await page.keyboard.press('Escape');
    await page.click('[data-stat="steps"]');
    await expect(page.locator('text=/steps.*tracker/i')).toBeVisible();
  });
});

