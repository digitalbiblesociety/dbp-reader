import stateReconciler from '../stateReconciler';

describe('stateReconciler utility function', () => {
  it('should correctly reconcile the given state objects', () => {
    const original = {
      profile: {
        userId: 'original',
      },
      settings: {
        userSettings: {
          toggleOptions: {
            crossReferences: { available: true },
            redLetter: { available: true },
          },
        },
      },
    };
    const incoming = {
      profile: {
        userId: '',
        unaffected: 'not affected',
      },
      settings: {
        userSettings: {
          toggleOptions: {
            unaffected: { available: true },
            crossReferences: { available: false },
            redLetter: { available: false },
          },
        },
      },
    };
    const reducedState = {
      profile: {
        userId: 'incoming',
        unaffected: 'not affected',
      },
      settings: {
        userSettings: {
          toggleOptions: {
            unaffected: { available: true },
            crossReferences: { available: false },
            redLetter: { available: false },
          },
        },
      },
    };
    const newState = stateReconciler(incoming, original, reducedState);
    const expectedState = {
      profile: {
        userId: 'original',
        unaffected: 'not affected',
      },
      settings: {
        userSettings: {
          toggleOptions: {
            unaffected: { available: true },
            crossReferences: { available: true },
            redLetter: { available: true },
          },
        },
      },
    };
    expect(newState).toEqual(expectedState);
  });
});
