import fetch from 'isomorphic-fetch';
import removeDuplicates from '../utils/removeDuplicateObjects';
import getAudio from './getAudioAsyncCall';
import request from './request';

export default async ({ filesets, bookId: lowerCaseBookId, chapter }) => {
	// Gather all initial data
	const bookId = lowerCaseBookId.toUpperCase();
	const setTypes = {
		audio_drama: true,
		audio: true,
		text_plain: true,
		text_format: true,
	};
	const formattedFilesetIds = [];
	const plainFilesetIds = [];
	const idsForBookMetadata = {};

	// Separate filesets by type
	filesets
		.filter((set) => set.id.slice(-4) !== 'DA16' && setTypes[set.type])
		.forEach((set) => {
			if (set.type === 'text_format') {
				formattedFilesetIds.push(set.id);
			} else if (set.type === 'text_plain') {
				plainFilesetIds.push(set.id);
			}

			// Gets one id for each fileset type
			idsForBookMetadata[set.type] = set.id;
		});
	// console.log('idsForBookMetadata', idsForBookMetadata);

	// const hasPlainText = !!plainFilesetIds.length;
	// const hasFormattedText = !!formattedFilesetIds.length;
	const bookMetaPromises = Object.values(idsForBookMetadata).map(async (id) => {
		// console.log('id', id);
		const url = `${
			process.env.BASE_API_ROUTE
		}/bibles/filesets/${id}/books?v=4&key=${process.env.DBP_API_KEY}&bucket=${
			process.env.DBP_BUCKET_ID
		}`;
		const res = await request(url).catch((e) => {
			if (process.env.NODE_ENV === 'development') {
				console.log('Error in request for formatted fileset: ', e.message); // eslint-disable-line no-console
			}
			return [];
		});
		// console.log('res', res);

		return res.data || [];
	});
	// start promise for formatted text
	// console.log('chapter in get init', chapter)
	const formattedPromises = formattedFilesetIds.map(async (id) => {
		const url = `${process.env.BASE_API_ROUTE}/bibles/filesets/${id}?bucket=${
			process.env.DBP_BUCKET_ID
		}&key=${
			process.env.DBP_API_KEY
		}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=text_format`;
		const res = await request(url).catch((e) => {
			if (process.env.NODE_ENV === 'development') {
				console.log('Error in request for formatted fileset: ', e.message); // eslint-disable-line no-console
			}
		});
		const path = res && res.data && res.data[0] && res.data[0].path;
		let text = '';
		if (path) {
			text = await fetch(path).then((textRes) => textRes.text()); // .catch((e) => console.log('Error fetching formatted text: '));
		}

		return text || '';
	});

	let plainTextJson = JSON.stringify({});
	// start promise for plain text
	const plainPromises = plainFilesetIds.map(async (id) => {
		const url = `${
			process.env.BASE_API_ROUTE
		}/bibles/filesets/${id}/${bookId}/${chapter}?key=${
			process.env.DBP_API_KEY
		}&v=4`;
		const res = await request(url)
			.then((json) => {
				plainTextJson = JSON.stringify(json);
				return json;
			})
			.catch((e) => {
				if (process.env.NODE_ENV === 'development') {
					console.error('Error in request for plain fileset: ', e.message); // eslint-disable-line no-console
				}
				return { data: [] };
			});

		return res ? res.data : [];
	});

	let plainTextFound = false;
	let plainText = [];
	/* eslint-disable */
	for (const promise of plainPromises) {
		if (plainTextFound) break;
		await promise
			.then((res) => {
				plainText = res;
				plainTextFound = true;
			})
			.catch((reason) => {
				if (process.env.NODE_ENV === 'development') {
					console.error('Reason race threw: ', reason.message); // eslint-disable-line no-console
				}
			});
	}
	const formattedText = await Promise.all(formattedPromises);
	const bookMetaResponse = await Promise.all(bookMetaPromises);
	const audioReturn = await getAudio(filesets, lowerCaseBookId, chapter)
		.then((data) => data)
		.catch((err) => {
			if (process.env.NODE_ENV === 'development') {
				console.error(
					`Error in getInitialChapterData -> getAudio catch statement: ${
						err.status
					}:${err.message}`,
				);
			}
			return { type: 'loadaudio', audioPaths: [''] };
		});
	// console.log('bookMetaResponse', bookMetaResponse);
	// console.log('Got through all requests in get initial');
	// console.log('book res length', bookMetaResponse.length);
	// console.log('book res reduced length', bookMetaResponse.reduce((a, c) => [...a, ...c], []).length);

	const bookMetaData = removeDuplicates(
		bookMetaResponse.reduce((a, c) => [...a, ...c], []),
		'book_id',
	);
	// console.log('waiting on audio');
	// console.log('bookMetaData', bookMetaData.length);

	/* eslint-enable */
	// console.log('audio loaded');
	// console.log('audioReturn', audioReturn);
	// Return a default object in the case that none of the api calls work
	return {
		plainText,
		bookMetaData,
		plainTextJson,
		audioPaths: audioReturn.audioPaths,
		formattedText: formattedText[0] || '',
	};
};
