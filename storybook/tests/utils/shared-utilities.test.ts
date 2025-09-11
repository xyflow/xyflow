import { describe, it, expect } from 'vitest';
import {
  validateInput,
  formatCurrency,
  formatDate,
  chunk,
  unique,
  runSharedTests,
  type ValidationRule,
  type TestCase,
} from './shared-tests';

describe('Shared Validation Utilities', () => {
  describe('validateInput', () => {
    const rules: ValidationRule[] = [
      { field: 'name', required: true, type: 'string', minLength: 2 },
      { field: 'age', required: true, type: 'number' },
      { field: 'email', required: false, type: 'string', maxLength: 50 },
    ];

    it('should validate required fields', () => {
      const input = { name: '', age: 25 };
      const result = validateInput(input, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('name is required');
    });

    it('should validate field types', () => {
      const input = { name: 'John', age: '25' }; // age should be number
      const result = validateInput(input, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('age must be of type number');
    });

    it('should validate minimum length', () => {
      const input = { name: 'J', age: 25 };
      const result = validateInput(input, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('name must be at least 2 characters');
    });

    it('should validate maximum length', () => {
      const input = {
        name: 'John',
        age: 25,
        email: 'a'.repeat(51) + '@example.com',
      };
      const result = validateInput(input, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('email must be no more than 50 characters');
    });

    it('should pass validation with valid input', () => {
      const input = { name: 'John Doe', age: 25, email: 'john@example.com' };
      const result = validateInput(input, rules);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle optional fields correctly', () => {
      const input = { name: 'John', age: 25 }; // email is optional
      const result = validateInput(input, rules);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

describe('Shared Formatting Utilities', () => {
  describe('formatCurrency', () => {
    it('should format USD currency by default', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should format different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
    });

    it('should handle zero and negative values', () => {
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-100)).toBe('-$100.00');
    });
  });

  describe('formatDate', () => {
    it('should format Date objects', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date);
      expect(formatted).toBe('12/25/2023');
    });

    it('should format date strings', () => {
      const formatted = formatDate('2023-12-25');
      expect(formatted).toBe('12/25/2023');
    });

    it('should handle different locales', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date, 'en-GB');
      expect(formatted).toBe('25/12/2023');
    });
  });
});

describe('Shared Array Utilities', () => {
  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const result = chunk(array, 3);

      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('should handle empty arrays', () => {
      const result = chunk([], 3);
      expect(result).toEqual([]);
    });

    it('should handle chunk size larger than array', () => {
      const array = [1, 2];
      const result = chunk(array, 5);

      expect(result).toEqual([[1, 2]]);
    });
  });

  describe('unique', () => {
    it('should remove duplicate values', () => {
      const array = [1, 2, 2, 3, 3, 3, 4];
      const result = unique(array);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should handle string arrays', () => {
      const array = ['a', 'b', 'a', 'c', 'b'];
      const result = unique(array);

      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty arrays', () => {
      const result = unique([]);
      expect(result).toEqual([]);
    });

    it('should preserve order of first occurrence', () => {
      const array = [3, 1, 2, 1, 3];
      const result = unique(array);

      expect(result).toEqual([3, 1, 2]);
    });
  });
});

describe('Shared Test Runner', () => {
  it('should provide a test runner function', () => {
    const testCases: TestCase[] = [
      { name: 'Test case 1', description: 'First test', expectedResult: 'success' },
      { name: 'Test case 2', description: 'Second test', expectedResult: 42 },
    ];

    const testFunction = (testCase: TestCase) => {
      expect(testCase.name).toBeDefined();
      expect(testCase.description).toBeDefined();
    };

    // Test that the function exists and can be called
    expect(typeof runSharedTests).toBe('function');

    // Test that it doesn't throw when called with valid parameters
    expect(() => runSharedTests(testCases, testFunction)).not.toThrow();
  });
});
