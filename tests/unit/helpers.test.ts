import { describe, it, expect } from 'vitest';
import {
  formatDate,
  getTodayDate,
  calculateBMI,
  calculateCalories,
  formatDuration,
} from '@utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date);
      expect(result).toMatch(/2024-01-15/);
    });

    it('should handle string dates', () => {
      const result = formatDate('2024-01-15');
      expect(result).toBe('2024-01-15');
    });
  });

  describe('getTodayDate', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const result = getTodayDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('calculateBMI', () => {
    it('should calculate BMI correctly', () => {
      const bmi = calculateBMI(75, 1.8); // 75kg, 1.8m
      expect(bmi).toBeCloseTo(23.15, 1);
    });

    it('should return 0 for invalid inputs', () => {
      expect(calculateBMI(0, 1.8)).toBe(0);
      expect(calculateBMI(75, 0)).toBe(0);
      expect(calculateBMI(-10, 1.8)).toBe(0);
    });

    it('should handle edge cases', () => {
      const bmi = calculateBMI(50, 1.5);
      expect(bmi).toBeGreaterThan(0);
      expect(bmi).toBeLessThan(50);
    });
  });

  describe('calculateCalories', () => {
    it('should calculate calories for running', () => {
      const calories = calculateCalories('run', 30, 75); // 30 min, 75kg
      expect(calories).toBeGreaterThan(0);
      expect(calories).toBeLessThan(1000);
    });

    it('should calculate calories for walking', () => {
      const calories = calculateCalories('walk', 60, 70);
      expect(calories).toBeGreaterThan(0);
      expect(calories).toBeLessThan(500);
    });

    it('should return 0 for invalid duration', () => {
      expect(calculateCalories('run', 0, 75)).toBe(0);
      expect(calculateCalories('run', -10, 75)).toBe(0);
    });

    it('should scale with weight', () => {
      const lightPerson = calculateCalories('run', 30, 60);
      const heavyPerson = calculateCalories('run', 30, 90);
      expect(heavyPerson).toBeGreaterThan(lightPerson);
    });
  });

  describe('formatDuration', () => {
    it('should format duration in seconds', () => {
      expect(formatDuration(45)).toBe('45s');
      expect(formatDuration(90)).toBe('1m 30s');
      expect(formatDuration(3600)).toBe('1h 0m');
      expect(formatDuration(3665)).toBe('1h 1m');
    });

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0s');
    });

    it('should handle large durations', () => {
      const result = formatDuration(7200); // 2 hours
      expect(result).toBe('2h 0m');
    });
  });
});

