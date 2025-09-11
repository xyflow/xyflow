import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Simple class to test
class Counter {
  private count = 0;

  increment(): void {
    this.count++;
  }

  decrement(): void {
    this.count--;
  }

  getCount(): number {
    return this.count;
  }

  reset(): void {
    this.count = 0;
  }
}

// Simple async function to test
async function fetchUserData(id: number): Promise<{ id: number; name: string }> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 10));
  return { id, name: `User ${id}` };
}

// Function that uses external dependency (to test mocking)
function getCurrentTime(): string {
  return new Date().toISOString();
}

describe('Counter Class', () => {
  let counter: Counter;

  beforeEach(() => {
    counter = new Counter();
  });

  it('should start with count of 0', () => {
    expect(counter.getCount()).toBe(0);
  });

  it('should increment count', () => {
    counter.increment();
    expect(counter.getCount()).toBe(1);

    counter.increment();
    expect(counter.getCount()).toBe(2);
  });

  it('should decrement count', () => {
    counter.increment();
    counter.increment();
    counter.decrement();
    expect(counter.getCount()).toBe(1);
  });

  it('should reset count to 0', () => {
    counter.increment();
    counter.increment();
    counter.reset();
    expect(counter.getCount()).toBe(0);
  });
});

describe('Async Functions', () => {
  it('should fetch user data', async () => {
    const userData = await fetchUserData(123);
    expect(userData).toEqual({
      id: 123,
      name: 'User 123',
    });
  });

  it('should handle multiple async calls', async () => {
    const [user1, user2] = await Promise.all([fetchUserData(1), fetchUserData(2)]);

    expect(user1.name).toBe('User 1');
    expect(user2.name).toBe('User 2');
  });
});

describe('Mocking and Spies', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should mock Date constructor', () => {
    const mockDate = new Date('2023-01-01T00:00:00.000Z');
    vi.spyOn(globalThis, 'Date').mockImplementation(() => mockDate);

    const result = getCurrentTime();
    expect(result).toBe('2023-01-01T00:00:00.000Z');
  });

  it('should test function calls with spies', () => {
    const mockFn = vi.fn();
    mockFn('test', 123);
    mockFn('another', 456);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('test', 123);
    expect(mockFn).toHaveBeenCalledWith('another', 456);
  });
});
