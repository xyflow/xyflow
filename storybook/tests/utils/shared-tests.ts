import { describe, it, expect } from 'vitest';

// Shared utility functions that can be used across different frameworks
export interface TestCase {
  name: string;
  description: string;
  expectedResult?: unknown;
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
}

// Shared validation utilities
export function validateInput(input: unknown, rules: ValidationRule[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  rules.forEach((rule) => {
    const value = (input as any)?.[rule.field];

    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${rule.field} is required`);
      return;
    }

    if (value !== undefined && rule.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rule.type) {
        errors.push(`${rule.field} must be of type ${rule.type}`);
      }
    }

    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
    }

    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      errors.push(`${rule.field} must be no more than ${rule.maxLength} characters`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Shared formatting utilities
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string, locale = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
}

// Shared array utilities
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// Generic test runner for shared utilities
export function runSharedTests(testCases: TestCase[], testFunction: (testCase: TestCase) => void) {
  describe('Shared Utility Tests', () => {
    testCases.forEach((testCase) => {
      it(testCase.name, () => {
        testFunction(testCase);
      });
    });
  });
}
