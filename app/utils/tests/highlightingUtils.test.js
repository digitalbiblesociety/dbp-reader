import * as utils from '../highlightingUtils';

describe('Highlighting utils methods', () => {
  describe('replaceCharsRegex', () => {
    it('should replace the expected characters', () => {
      const string = '\r\n※†*✝';
      const replacedString = string.replace(utils.replaceCharsRegex, 'a');
      expect(replacedString).toEqual('aaaaaa');
    });
  });
  describe('getReference', () => {
    it('should generate a reference off the given parameters', () => {
      const reference = utils.getReference(1, 3, 'Genesis', 5);

      expect(reference).toEqual('Genesis 5:1-3');
    });
  });
});
