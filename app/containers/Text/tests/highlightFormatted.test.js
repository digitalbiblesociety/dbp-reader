import highlightFormattedText from '../highlightFormattedText';
import sampleText, { result } from './sampleText';
import sampleHighlights from './sampleHighlights.json';

describe('highlightFormattedText', () => {
	it('Should be a function', () => expect(typeof highlightFormattedText).toBe('function'));
	it('Should return a string', () => expect(typeof highlightFormattedText(sampleHighlights, sampleText)).toBe('string'));
	it('Should highlight the text', () => expect(highlightFormattedText(sampleHighlights, sampleText)).toEqual(result));
});
