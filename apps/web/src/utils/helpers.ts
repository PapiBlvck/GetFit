/**
 * Format a date to YYYY-MM-DD string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return formatDate(new Date());
};

/**
 * Calculate BMI (Body Mass Index)
 */
export const calculateBMI = (weight: number, height: number): number => {
  // weight in kg, height in meters
  // Return 0 for invalid inputs
  if (weight <= 0 || height <= 0) return 0;
  return Number((weight / (height * height)).toFixed(1));
};

/**
 * Calculate calories burned based on activity type
 */
export const calculateCalories = (
  activityType: string,
  duration: number,
  weight: number
): number => {
  // Return 0 for invalid duration
  if (duration <= 0) return 0;
  
  // MET values for different activities
  const metValues: Record<string, number> = {
    run: 10,
    walk: 3.5,
    cycle: 8,
    swim: 9,
    other: 5,
  };
  
  const met = metValues[activityType] || 5;
  // Formula: Calories = MET * weight(kg) * duration(hours)
  return Math.round(met * weight * (duration / 60));
};

/**
 * Calculate calories burned based on intensity
 */
export const calculateCaloriesBurned = (
  duration: number,
  intensity: 'low' | 'medium' | 'high',
  weight: number
): number => {
  const multipliers = {
    low: 3.5,
    medium: 7,
    high: 10,
  };
  
  return Math.round((duration * multipliers[intensity] * weight) / 200);
};

/**
 * Format duration in seconds to readable string
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours}h 0m`;
  }
  
  if (secs > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${minutes}m`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate a random ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Truncate text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};



