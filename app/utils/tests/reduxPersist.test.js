import reduxPersist from '../reduxPersist';

describe('redux persist utility config', () => {
  it('should match previous snapshot', () => {
    expect(reduxPersist).toMatchSnapshot();
  });
});
