import url from '../hrefLinkOrAsLink';

const props = {
	textId: 'ENGESV',
	bookId: 'GEN',
	chapter: 9,
	nextVerse: '',
	isHref: true,
	audioType: 'audio_drama',
};

describe('Url route tests', () => {
	it('Return the correct url if it is an href', () => {
		expect(url(props)).toEqual(
			'/app?bibleId=ENGESV&bookId=GEN&chapter=9&audio_type=audio_drama',
		);
	});
	it('Return the correct url if it is an as', () => {
		expect(url({ ...props, isHref: false })).toEqual(
			'/bible/ENGESV/GEN/9?audio_type=audio_drama',
		);
	});
	it('Return the correct url if it does not have audio', () => {
		expect(url({ ...props, audioType: '' })).toEqual(
			'/app?bibleId=ENGESV&bookId=GEN&chapter=9',
		);
	});
	it('Return the correct url if it is an as and a verse', () => {
		expect(url({ ...props, isHref: false, nextVerse: 2 })).toEqual(
			'/bible/ENGESV/GEN/9/2?audio_type=audio_drama',
		);
	});
	it('Return the correct url if it has a verse and href', () => {
		expect(url({ ...props, nextVerse: 2 })).toEqual(
			'/app?bibleId=ENGESV&bookId=GEN&chapter=9&verse=2&audio_type=audio_drama',
		);
	});
});
