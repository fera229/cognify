import add from '@/util/math';
import { expect, test, describe } from '@jest/globals';

describe('add function', () => {
  test('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
