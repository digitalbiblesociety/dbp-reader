import get from '../get';

const successMessage = 'get function worked!';
const obj = {
  level1: {
    level2: [
      {},
      {
        arrayLevel1: successMessage,
      },
    ],
  },
};

describe('get utility function', () => {
  it('should get the value at an objects path', () => {
    expect(get(obj, ['level1', 'level2', '1', 'arrayLevel1'])).toEqual(
      successMessage,
    );
  });
  it('should return undefined if no object', () => {
    expect(get(null, ['level1', 'level2', '1', 'arrayLevel1'])).toEqual(
      undefined,
    );
  });
  it('should return undefined if no value at path', () => {
    expect(
      get(obj, ['level1', 'level2', '1', 'arrayLevel1', 'arrayLevel2']),
    ).toEqual(undefined);
  });
});
