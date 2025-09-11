import { describe, it, expect } from 'vitest';

// Shared test cases that can be used across different frameworks
export interface ComponentTestCase {
  name: string;
  storyName: string;
  expectedProps?: Record<string, unknown>;
  expectedBehavior?: string;
}

export const buttonTestCases: ComponentTestCase[] = [
  {
    name: 'Primary button configuration',
    storyName: 'Primary',
    expectedProps: { primary: true, label: 'Button' },
    expectedBehavior: 'should render as primary variant'
  },
  {
    name: 'Secondary button configuration',
    storyName: 'Secondary', 
    expectedProps: { label: 'Button' },
    expectedBehavior: 'should render as secondary variant (default)'
  },
  {
    name: 'Large button configuration',
    storyName: 'Large',
    expectedProps: { size: 'large', label: 'Button' },
    expectedBehavior: 'should render with large size'
  },
  {
    name: 'Small button configuration',
    storyName: 'Small',
    expectedProps: { size: 'small', label: 'Button' },
    expectedBehavior: 'should render with small size'
  }
];

// Generic test runner that works with any story collection
export function runStoryTests(stories: Record<string, { args: Record<string, unknown>; component?: unknown; render?: unknown }>, testCases: ComponentTestCase[]) {
  describe('Story Configuration Tests', () => {
    testCases.forEach(({ name, storyName, expectedProps }) => {
      it(name, () => {
        const story = stories[storyName];
        expect(story).toBeDefined();
        
        if (expectedProps) {
          Object.entries(expectedProps).forEach(([key, value]) => {
            expect(story.args[key]).toBe(value);
          });
        }
        
        // All stories should have onClick handler from meta
        expect(story.args.onClick).toBeDefined();
      });
    });

    it('All stories should be composable', () => {
      Object.keys(stories).forEach(storyName => {
        const story = stories[storyName];
        expect(story.args).toBeDefined();
        // Composed stories are functions, not objects with component/render
        expect(typeof story).toBe('function');
      });
    });
  });
}
