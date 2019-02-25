import getAudioAsyncCall from '../getAudioAsyncCall';

const params = {
  filesets: ['ENGESVN2DA', 'ENGESVN1DA', 'ENGESVO1DA', 'ENGESVO2DA'],
  bookId: 'MAT',
  chapter: 1,
  audioType: 'audio_drama',
};

describe('Get audio async call utility function test', () => {
  it('should return expected audio object with valid parameters', async () => {
    const result = await getAudioAsyncCall(
      params.filesets,
      params.bookId,
      params.chapter,
      params.audioType,
    );

    expect(result).toHaveProperty('type', 'loadaudio');
    expect(result).toHaveProperty('audioPaths');
    expect(Array.isArray(result.audioPaths)).toEqual(true);
  });
});
