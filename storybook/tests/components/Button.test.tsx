import { composeStories } from '@storybook/react-vite';
import { describe, it, expect } from 'vitest';
import * as stories from '../../react/src/stories/Button.stories';
import { runStoryTests, buttonTestCases } from '../utils/shared-tests';

const { Primary, Secondary, Large, Small } = composeStories(stories);

// Run shared tests
runStoryTests({ Primary, Secondary, Large, Small }, buttonTestCases);

// Additional Button-specific tests
describe('Button Component Specifics', () => {
  it('should be composable functions', () => {
    expect(typeof Primary).toBe('function');
    expect(typeof Secondary).toBe('function');
    expect(typeof Large).toBe('function');
    expect(typeof Small).toBe('function');
  });

  it('should inherit meta-level props', () => {
    // All stories should inherit the onClick from meta
    expect(Primary.args.onClick).toBeDefined();
    expect(Secondary.args.onClick).toBeDefined();
    expect(Large.args.onClick).toBeDefined();
    expect(Small.args.onClick).toBeDefined();
  });

  it('should have different variants configured', () => {
    expect(Primary.args.primary).toBe(true);
    expect(Secondary.args.primary).toBeUndefined();
    expect(Large.args.size).toBe('large');
    expect(Small.args.size).toBe('small');
  });
});
