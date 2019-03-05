import checkStore from '../checkStore';

const validStore = {
  dispatch: () => {},
  subscribe: () => {},
  getState: () => {},
  replaceReducer: () => {},
  runSaga: () => {},
  injectedReducers: {},
  injectedSagas: {},
};
const invalidStore = {
  dispatch: () => {},
  subscribe: () => {},
  getState: () => {},
  replaceReducer: () => {},
  injectedReducers: {},
  injectedSagas: {},
};

describe('Check store utility function', () => {
  it('should not throw for a valid store', () => {
    expect(() => {
      checkStore(validStore);
    }).not.toThrow();
  });
  it('should throw for a valid store', () => {
    expect(() => {
      checkStore(invalidStore);
    }).toThrow();
  });
});
