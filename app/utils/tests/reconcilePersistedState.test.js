import reconcile from '../reconcilePersistedState';

const initialValue = 'initial value';

describe('reconcile persisted state utility function', () => {
  it('should remove previous state', () => {
    localStorage.setItem('bible_is_v1_settings', initialValue);
    localStorage.setItem('bible_is_v1_profile', initialValue);
    localStorage.setItem('bible_is_v1_notebook', initialValue);
    expect(localStorage.getItem('bible_is_v1_settings')).toEqual(initialValue);
    expect(localStorage.getItem('bible_is_v1_profile')).toEqual(initialValue);
    expect(localStorage.getItem('bible_is_v1_notebook')).toEqual(initialValue);

    reconcile(['settings', 'profile', 'notebook'], 'bible_is_v1_');

    expect(localStorage.getItem('bible_is_v1_settings')).not.toEqual(
      initialValue,
    );
    expect(localStorage.getItem('bible_is_v1_profile')).not.toEqual(
      initialValue,
    );
    expect(localStorage.getItem('bible_is_v1_notebook')).not.toEqual(
      initialValue,
    );
  });
});
