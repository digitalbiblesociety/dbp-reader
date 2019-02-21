import { parseCookie, parseCookieValue } from '../parseCookie';

const cookie =
	'bible_is_audio_type=audio_drama; bible_is_words_of_jesus=true; _ga=GA1.1.2143118961.1548370551; bible_is_userSettings_toggleOptions_justifiedText_active=true; bible_is_font_size=42; bible_is_font_family=sans; bible_is_userSettings_toggleOptions_readersMode_active=false; bible_is_userSettings_toggleOptions_oneVersePerLine_active=false; bible_is_autoplay=true; bible_is_playbackrate=1.25; bible_is_volume=0.71; bible_is_audio_open=false; bible_is_theme=red';

describe('Parse Cookie utility function tests', () => {
	it('should parse a cookie string accurately', () => {
		expect(parseCookie(cookie)).toHaveProperty(
			'bible_is_audio_type',
			'audio_drama',
		);
		expect(parseCookie(cookie)).toHaveProperty('bible_is_font_size', 42);
	});
	it('should return the correct value for each value type', () => {
		expect(parseCookieValue('audio')).toEqual('audio');
		expect(parseCookieValue('42')).toEqual(42);
		expect(parseCookieValue('false')).toEqual(false);
		expect(parseCookieValue('null')).toEqual(false);
		expect(parseCookieValue('')).toEqual(false);
		expect(parseCookieValue()).toEqual(false);
		expect(parseCookieValue('true')).toEqual(true);
	});
});
