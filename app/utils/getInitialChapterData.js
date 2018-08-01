import fetch from 'isomorphic-fetch';
import request from './request';

export default async ({ filesets, bookId: lowerCaseBookId, chapter }) => {
	// Gather all initial data
	const bookId = lowerCaseBookId.toUpperCase();
	const formattedFilesetIds = [];
	const plainFilesetIds = [];

	// Separate filesets by type
	filesets.forEach((set) => {
		if (set.type === 'text_format') {
			formattedFilesetIds.push(set.id);
		} else if (set.type === 'text_plain') {
			plainFilesetIds.push(set.id);
		}
	});

	// const hasPlainText = !!plainFilesetIds.length;
	// const hasFormattedText = !!formattedFilesetIds.length;

	// start promise for formatted text
	const formattedPromises = formattedFilesetIds.map(async (id) => {
		const url = `${process.env.BASE_API_ROUTE}/bibles/filesets/${id}?bucket=${
			process.env.DBP_BUCKET_ID
		}&key=${
			process.env.DBP_API_KEY
		}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=text_format`;
		const res = await request(url); // .catch((e) => console.log('Error in request for formatted fileset: '));
		const path = res.data[0].path;
		const text = await fetch(path).then((textRes) => textRes.text()); // .catch((e) => console.log('Error fetching formatted text: '));

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
				console.log('Error in request for plain fileset: ', e.message); // eslint-disable-line no-console
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
					console.log('Reason race threw: ', reason.message); // eslint-disable-line no-console
				}
			});
	}
	/* eslint-enable */
	const formattedText = await Promise.all(formattedPromises);
	// console.log('Got through all requests in get initial');

	// Return a default object in the case that none of the api calls work
	return { plainText, formattedText: formattedText[0] || '', plainTextJson };
};
