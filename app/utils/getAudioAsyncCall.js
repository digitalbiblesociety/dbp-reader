import get from 'lodash/get';
import request from './request';

export default async (filesets, bookId, chapter) => {
	// console.log('Started get audio call');
	// console.log('filesets', filesets);
	const filteredFilesets = filesets.reduce((a, file) => {
		const newFile = { ...a };

		if (
			(file.type === 'audio' || file.type === 'audio_drama') &&
			file.id.slice(-4) !== 'DA16'
		) {
			// console.log('is 16 bit', file.id.slice(-4) === 'DA16')
			newFile[file.id] = file;
		}

		return newFile;
	}, {});
	// If there isn't any audio then I want to just load an empty string and stop the function
	// console.log(filteredFilesets)
	if (!Object.keys(filteredFilesets).length) {
		return { type: 'loadaudio', audioPaths: [''] };
	}
	// console.log('filtered filesets', filteredFilesets);
	// console.log('filtered', filteredFilesets);
	// console.log('normal', filesets);
	const completeAudio = [];
	const ntAudio = [];
	const otAudio = [];
	const partialOtAudio = [];
	const partialNtAudio = [];
	const partialNtOtAudio = [];

	Object.entries(filteredFilesets)
		.sort((a, b) => {
			if (a[1].type === 'audio_drama') return 1;
			if (b[1].type === 'audio_drama') return 1;
			if (a[1].type > b[1].type) return 1;
			if (a[1].type < b[1].type) return -1;
			return 0;
		})
		.forEach((fileset) => {
			if (fileset[1].size === 'C') {
				completeAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'NT') {
				ntAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'OT') {
				otAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'OTP') {
				partialOtAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'NTP') {
				partialNtAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'NTPOTP') {
				partialNtOtAudio.push({ id: fileset[0], data: fileset[1] });
			}
		});
	// console.log('audio arrays', '\n', completeAudio, '\n', ntAudio, '\n', otAudio, '\n', partialNtAudio, '\n', partialNtOtAudio, '\n', partialOtAudio);
	const otLength = otAudio.length;
	const ntLength = ntAudio.length;

	let otHasUrl = false;
	let ntHasUrl = false;

	if (completeAudio.length) {
		// console.log('Bible has complete audio', completeAudio);
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				completeAudio,
				[0, 'id'],
			)}?bucket=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				completeAudio,
				[0, 'data', 'type'],
			)}`;
			const response = await request(reqUrl);
			// console.log('complete audio response object', response);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('complete audio path', audioPaths);
			return {
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(completeAudio, [0, 'id']),
			};
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio complete audio', error); // eslint-disable-line no-console
				return { type: 'loadaudio', audioPaths: [''] };
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
				return { type: 'loadaudio', audioPaths: [''] };
			}
		}
	} else if (ntLength && !otLength) {
		try {
			// console.log('ntAudio', ntAudio);

			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				ntAudio,
				[0, 'id'],
			)}?bucket=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				ntAudio,
				[0, 'data', 'type'],
			)}`;
			const response = await request(reqUrl);
			// console.log('nt audio response object', response);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('nt audio path', audioPaths);
			ntHasUrl = !!audioPaths[0];
			return {
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(ntAudio, [0, 'id']),
			};
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error); // eslint-disable-line no-console
				return { type: 'loadaudio', audioPaths: [''] };
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
				return { type: 'loadaudio', audioPaths: [''] };
			}
		}
	} else if (otLength && !ntLength) {
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				otAudio,
				[0, 'id'],
			)}?bucket=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				otAudio,
				[0, 'data', 'type'],
			)}`;
			const response = await request(reqUrl);
			// console.log('ot audio response object', response);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('ot audio path', audioPaths);
			// otPath = audioPaths;
			otHasUrl = !!audioPaths[0];
			return {
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(otAudio, [0, 'id']),
			};
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error); // eslint-disable-line no-console
				return { type: 'loadaudio', audioPaths: [''] };
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
				return { type: 'loadaudio', audioPaths: [''] };
			}
		}
	} else if (ntLength && otLength) {
		let ntPath = '';
		let otPath = '';
		// console.log('trying nt & ot', ntLength && !otLength, '\n', ntAudio, '\n', otAudio);

		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				ntAudio,
				[0, 'id'],
			)}?bucket=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				ntAudio,
				[0, 'data', 'type'],
			)}`;
			const response = await request(reqUrl);
			// console.log('nt audio response object', response);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('nt audio path', audioPaths);
			ntPath = audioPaths;
			// return ({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error); // eslint-disable-line no-console
				return { type: 'loadaudio', audioPaths: [''] };
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
				return { type: 'loadaudio', audioPaths: [''] };
			}
		}
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				otAudio,
				[0, 'id'],
			)}?bucket=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				otAudio,
				[0, 'data', 'type'],
			)}`;
			const response = await request(reqUrl);
			// console.log('ot audio response object', response);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('ot audio path', audioPaths);
			otPath = audioPaths;
			// return ({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error); // eslint-disable-line no-console
				return { type: 'loadaudio', audioPaths: [''] };
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
				return { type: 'loadaudio', audioPaths: [''] };
			}
		}
		ntHasUrl = !!ntPath;
		otHasUrl = !!otPath;
		return {
			type: 'loadaudio',
			audioPaths: ntPath || otPath,
			audioFilesetId: ntPath
				? get(ntAudio, [0, 'id'])
				: get(otAudio, [0, 'id']),
		};
	}

	if (partialOtAudio.length && !otLength && (!otHasUrl && !ntHasUrl)) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		// console.log('files that contain partial audio', partialAudio);
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				partialOtAudio,
				[0, 'id'],
			)}?bucket=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				partialOtAudio,
				[0, 'data', 'type'],
			)}`;
			const response = await request(reqUrl);
			// console.log('partial audio response object', response);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			// console.log('partial audio path', audioPaths);
			return {
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(partialOtAudio, [0, 'id']),
			};
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
				return { type: 'loadaudio', audioPaths: [''] };
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
				return { type: 'loadaudio', audioPaths: [''] };
			}
		}
	}

	if (partialNtAudio.length && !ntLength && (!otHasUrl && !ntHasUrl)) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		// console.log('files that contain partial audio', partialAudio);
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				partialNtAudio,
				[0, 'id'],
			)}?bucket=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				partialNtAudio,
				[0, 'data', 'type'],
			)}`;
			const response = await request(reqUrl);
			// console.log('partial audio response object', response);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			// console.log('partial audio path', audioPaths);
			return {
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(partialNtAudio, [0, 'id']),
			};
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
				return { type: 'loadaudio', audioPaths: [''] };
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
				return { type: 'loadaudio', audioPaths: [''] };
			}
		}
	}

	if (
		partialNtOtAudio.length &&
		(!otLength && !ntLength) &&
		(!otHasUrl && !ntHasUrl)
	) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		// console.log('files that contain partial audio', partialAudio);
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				partialNtOtAudio,
				[0, 'id'],
			)}?bucket=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				partialNtOtAudio,
				[0, 'data', 'type'],
			)}`;
			const response = await request(reqUrl);
			// console.log('partial audio response object', response);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			// console.log('partial audio path', audioPaths);
			return {
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(partialNtOtAudio, [0, 'id']),
			};
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
				return { type: 'loadaudio', audioPaths: [''] };
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
				return { type: 'loadaudio', audioPaths: [''] };
			}
		}
	}

	return { type: 'loadaudio', audioPaths: [''] };
};
