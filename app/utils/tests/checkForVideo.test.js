import checkForVideo from '../checkForVideoAsync';
// Not sure if this should depend on the api returning correctly or be mocked...
describe('check for video utility function', () => {
  it('should return true if there is video', async () => {
    const result = await checkForVideo('ENGNIVP2DV', 'MRK', 1);
    expect(result).toEqual(true);
  });
  it('should return false if there is no video', async () => {
    const result = await checkForVideo('ENGNIVP2DV', 'MAT', 1);
    expect(result).toEqual(false);
  });
  it('should return false if there is an invalid fileset id', async () => {
    const result = await checkForVideo('a', 'MAT', 1);
    expect(result).toEqual(false);
  });
  it('should return false if there is no fileset id', async () => {
    const result = await checkForVideo('', 'MAT', 1);
    expect(result).toEqual(false);
  });
  it('should return false if there is an invalid bookid', async () => {
    const result = await checkForVideo('ENGESV', 'aaa', 1);
    expect(result).toEqual(false);
  });
  it('should return false if there is an error', async () => {
    const result = await checkForVideo('ENGESV', 'MAT', 1);
    jest.mock(
      '../request',
      () =>
        new Promise((res, rej) => rej(new Error('Mocked error for testing!'))),
    );
    expect(result).toEqual(false);
  });
});
