import { parseCookie, parseCookieValue } from '../parseCookie';

describe('parseCookie Tests', () => {
	let cookie;
	beforeEach(() => {
		cookie =
			'G_AUTHUSER_H=2; mySpecialTest=the stuff inside the cookie; language=javascript; yummy_cookie=chocolate; type=samurai; bible_is_volume=0.54; bible_is_playbackrate=2; bible_is_autoplay=false; G_AUTHUSER_H=0; _ga=GA1.1.608880893.1533686689; G_AUTHUSER_H=1';
	});
	it('should return an object', () => {
		expect(typeof parseCookie(cookie) === 'object').toEqual(true);
	});
	it('should only return keys that start with bible_is', () => {
		const parsedCookies = parseCookie(cookie);
		const hasBadKeys = Object.keys(parsedCookies).some(
			(cookieKey) => !cookieKey.includes('bible_is'),
		);
		expect(hasBadKeys).toBe(false);
	});
});

describe('parseCookieValue tests', () => {
	it('should return true if given "true" as a string', () => {
		expect(parseCookieValue('true')).toBe(true);
	});
	it('should return false if given "false" as a string', () => {
		expect(parseCookieValue('false')).toBe(false);
	});
});
