import bugsnagServer from '../bugsnagServer';

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
    expect(bugsnagServer).toHaveProperty('use');
    expect(bugsnagServer).toHaveProperty('notify');
    expect(bugsnagServer).toHaveProperty('getPlugin');
  });
});
