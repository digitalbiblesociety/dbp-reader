import * as utils from '../highlightingUtils';

describe('Highlighting utils methods', () => {
  describe('replaceCharsRegex', () => {
    it('should replace the expected characters', () => {
      const string = '\r\n※†*✝';
      const replacedString = string.replace(utils.replaceCharsRegex, 'a');
      expect(replacedString).toEqual('aaaaaa');
    });
  });
});
