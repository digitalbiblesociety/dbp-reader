import getInitialChapterData from '../getInitialChapterData';

const params = {
  plainFilesetIds: ['ENGESV'],
  formattedFilesetIds: ['ENGESV'],
  bookId: 'MAT',
  chapter: 1,
};

describe('get initial chapter data utility function', () => {
  it('should return an object with three key/value pairs', async () => {
    const result = await getInitialChapterData(params);

    expect(result).toHaveProperty('plainText');
    expect(result).toHaveProperty('plainTextJson');
    expect(result).toHaveProperty('formattedText');
  });
  it('should return correct default data with no filesets given', async () => {
    const result = await getInitialChapterData({
      ...params,
      plainFilesetIds: [],
      formattedFilesetIds: [],
    });

    expect(result).toHaveProperty('plainText', []);
    expect(result).toHaveProperty('plainTextJson', JSON.stringify({}));
    expect(result).toHaveProperty('formattedText', '');
  });
  it('should return correct default data on errors', async () => {
    const result = await getInitialChapterData({
      ...params,
      plainFilesetIds: ['ENGESVS'],
      formattedFilesetIds: ['ENGESVS'],
    });

    expect(result).toHaveProperty('plainText', []);
    expect(result).toHaveProperty('plainTextJson', JSON.stringify({}));
    expect(result).toHaveProperty('formattedText', '');
  });
});
