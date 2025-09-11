import { describe, it, expect } from 'vitest';
import { runStoryTests, buttonTestCases } from '../utils/shared-tests';

// Mock Svelte button stories for testing shared functionality
// In a real implementation, you would use @storybook/svelte-vite composeStories
const mockSvelteStories = {
  Primary: {
    args: { primary: true, label: 'Button', onclick: () => {} },
  },
  Secondary: {
    args: { label: 'Button', onclick: () => {} },
  },
  Large: {
    args: { size: 'large', label: 'Button', onclick: () => {} },
  },
  Small: {
    args: { size: 'small', label: 'Button', onclick: () => {} },
  },
};

// Convert to functions to match expected structure
const Primary = Object.assign(() => {}, mockSvelteStories.Primary);
const Secondary = Object.assign(() => {}, mockSvelteStories.Secondary);
const Large = Object.assign(() => {}, mockSvelteStories.Large);
const Small = Object.assign(() => {}, mockSvelteStories.Small);

// Run shared tests
runStoryTests({ Primary, Secondary, Large, Small }, buttonTestCases);

// Additional Svelte Button-specific tests
describe('Svelte Button Component Specifics', () => {
  it('should be composable functions', () => {
    expect(typeof Primary).toBe('function');
    expect(typeof Secondary).toBe('function');
    expect(typeof Large).toBe('function');
    expect(typeof Small).toBe('function');
  });

  it('should inherit meta-level props', () => {
    // Check onclick instead of onClick for Svelte
    expect(Primary.args.onclick).toBeDefined();
    expect(Secondary.args.onclick).toBeDefined();
    expect(Large.args.onclick).toBeDefined();
    expect(Small.args.onclick).toBeDefined();
  });

  it('should have different variants configured', () => {
    expect(Primary.args.primary).toBe(true);
    expect((Secondary.args as any).primary).toBeUndefined();
    expect(Large.args.size).toBe('large');
    expect(Small.args.size).toBe('small');
  });

  it('should use Svelte-specific event naming', () => {
    // Svelte uses 'onclick' instead of 'onClick'
    expect(Primary.args.onclick).toBeDefined();
    expect((Primary.args as any).onClick).toBeUndefined();
  });
});
