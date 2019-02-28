import deepDiff from '../deepDifferenceObject';

describe('deep difference object', () => {
  it('should return the elements that are different between the first element and second element', () => {
    const obj1 = {
      key1: [{}, { object1: 'second element value' }],
      key2: [],
    };
    const obj2 = {
      key1: [{}, { object1: 'second element value' }],
      key2: [
        {},
        { object1: 'second element value' },
        { object2: 'third element value' },
      ],
      key3: [],
    };

    expect(deepDiff(obj1, obj2)).toEqual({ key2: [] });
  });
  it('should return the elements that are different between the first element and second element', () => {
    const obj2 = {
      key1: [{}, { object1: 'second element value' }],
      key2: [],
    };
    const obj1 = {
      key1: [{}, { object1: 'second element value' }],
      key2: [
        {},
        { object1: 'second element value' },
        { object2: 'third element value' },
      ],
      key3: [],
    };

    expect(deepDiff(obj1, obj2)).toEqual({
      key2: [
        {},
        { object1: 'second element value' },
        { object2: 'third element value' },
      ],
      key3: [],
    });
  });
});
