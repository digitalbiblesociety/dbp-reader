import getBookMetadata from '../getBookMetaData';

const idsForBookMetadata = [
	['audio', 'ENGNIVN1DA'],
	['audio', 'ENGNIVO1DA'],
	['audio_drama', 'ENGNIVN2DA'],
	['audio_drama', 'ENGNIVO2DA'],
	['text_plain', 'ENGNIV'],
	['text_format', 'ENGNIV'],
	['video_stream', 'ENGNIVP2DV'],
];

describe('getBookMetaData utility function', () => {
	it('should return two arrays', async () => {
		const [filteredData, allData] = await getBookMetadata({
			idsForBookMetadata,
		});
		expect(Array.isArray(filteredData)).toEqual(true);
		expect(Array.isArray(allData)).toEqual(true);
	});
});
