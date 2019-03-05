import bugsnagClient from '../bugsnagClient';

jest.mock('@bugsnag/js', () =>
  jest.fn(() => ({
    use: jest.fn(),
    notify: jest.fn(),
    getPlugin: jest.fn(),
  })),
);
jest.mock('@bugsnag/plugin-react', () => jest.fn());

describe('bugsnag server utility function', () => {
  it('should return an object with the appropriate handlers', () => {
    expect(bugsnagClient).toHaveProperty('use');
    expect(bugsnagClient).toHaveProperty('notify');
    expect(bugsnagClient).toHaveProperty('getPlugin');
  });
});
