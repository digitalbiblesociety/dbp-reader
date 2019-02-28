import get from 'lodash/get';
import request from './request';
// TODO: Rewrite handling of audio calls to intelligently determine whether
// the resource is NT or OT and reduce number of calls
export default async (filesets, bookId, chapter, audioType) => {
	const audioReturnObject = { type: 'loadaudio', audioPaths: [''] };

	const filteredFilesets = filesets.reduce((a, file) => {
		const newFile = { ...a };

		if (audioType && file.type === audioType && file.id.slice(-4) !== 'DA16') {
			newFile[file.id] = file;
		} else if (
			!audioType &&
			(file.type === 'audio' || file.type === 'audio_drama') &&
			file.id.slice(-4) !== 'DA16'
		) {
			newFile[file.id] = file;
		}

		return newFile;
	}, {});
	// If there isn't any audio then I want to just load an empty string and stop the function
	if (!Object.keys(filteredFilesets).length) {
		return { type: 'loadaudio', audioPaths: [''] };
	}

	const completeAudio = [];
	const ntAudio = [];
	const otAudio = [];
	const partialOtAudio = [];
	const partialNtAudio = [];
	const partialNtOtAudio = [];

	Object.entries(filteredFilesets)
		.sort((a, b) => {
			if (a[1].type === audioType) return 1;
			if (b[1].type === audioType) return 1;
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
	const otLength = otAudio.length;
	const ntLength = ntAudio.length;

	let otHasUrl = false;
	let ntHasUrl = false;

	if (completeAudio.length) {
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				completeAudio,
				[0, 'id'],
			)}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
				process.env.DBP_API_KEY
			}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(completeAudio, [
				0,
				'data',
				'type',
			])}`;
			const response = await request(reqUrl);
			audioReturnObject.audioPaths = [get(response, ['data', 0, 'path'])];
			audioReturnObject.audioFilesetId = get(completeAudio, [0, 'id']);
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				/* eslint-disable no-console */
				console.error(
					'Caught in getChapterAudio complete audio',
					error.message,
				);
				/* eslint-enable no-console */
			}
		}
	} else if (ntLength && !otLength) {
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				ntAudio,
				[0, 'id'],
			)}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
				process.env.DBP_API_KEY
			}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(ntAudio, [
				0,
				'data',
				'type',
			])}`;
			const response = await request(reqUrl);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			ntHasUrl = !!audioPaths[0];

			audioReturnObject.audioPaths = audioPaths;
			audioReturnObject.audioFilesetId = get(ntAudio, [0, 'id']);
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error.message); // eslint-disable-line no-console
			}
		}
	} else if (otLength && !ntLength) {
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				otAudio,
				[0, 'id'],
			)}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
				process.env.DBP_API_KEY
			}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(otAudio, [
				0,
				'data',
				'type',
			])}`;
			const response = await request(reqUrl);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			otHasUrl = !!audioPaths[0];

			audioReturnObject.audioPaths = audioPaths;
			audioReturnObject.audioFilesetId = get(otAudio, [0, 'id']);
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error.message); // eslint-disable-line no-console
			}
		}
	} else if (ntLength && otLength) {
		let ntPath = '';
		let otPath = '';

		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				ntAudio,
				[0, 'id'],
			)}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
				process.env.DBP_API_KEY
			}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(ntAudio, [
				0,
				'data',
				'type',
			])}`;
			const response = await request(reqUrl);
			ntPath = [get(response, ['data', 0, 'path'])];
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error.message); // eslint-disable-line no-console
			}
		}
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				otAudio,
				[0, 'id'],
			)}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
				process.env.DBP_API_KEY
			}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(otAudio, [
				0,
				'data',
				'type',
			])}`;
			const response = await request(reqUrl);
			otPath = [get(response, ['data', 0, 'path'])];
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error.message); // eslint-disable-line no-console
			}
		}
		ntHasUrl = !!ntPath;
		otHasUrl = !!otPath;
		audioReturnObject.audioPaths = ntPath || otPath || [''];
		audioReturnObject.audioFilesetId = ntPath
			? get(ntAudio, [0, 'id'])
			: get(otAudio, [0, 'id']);
	}

	if (partialOtAudio.length && !otLength && (!otHasUrl && !ntHasUrl)) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				partialOtAudio,
				[0, 'id'],
			)}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
				process.env.DBP_API_KEY
			}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(partialOtAudio, [
				0,
				'data',
				'type',
			])}`;
			const response = await request(reqUrl);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			audioReturnObject.audioPaths = audioPaths;
			audioReturnObject.audioFilesetId = get(partialOtAudio, [0, 'id']);
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error.message); // eslint-disable-line no-console
			}
		}
	}

	if (partialNtAudio.length && !ntLength && (!otHasUrl && !ntHasUrl)) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				partialNtAudio,
				[0, 'id'],
			)}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
				process.env.DBP_API_KEY
			}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(partialNtAudio, [
				0,
				'data',
				'type',
			])}`;
			const response = await request(reqUrl);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			audioReturnObject.audioPaths = audioPaths;
			audioReturnObject.audioFilesetId = get(partialNtAudio, [0, 'id']);
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error.message); // eslint-disable-line no-console
			}
		}
	}

	if (
		partialNtOtAudio.length &&
		(!otLength && !ntLength) &&
		(!otHasUrl && !ntHasUrl)
	) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				partialNtOtAudio,
				[0, 'id'],
			)}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
				process.env.DBP_API_KEY
			}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				partialNtOtAudio,
				[0, 'data', 'type'],
			)}`;
			const response = await request(reqUrl);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			audioReturnObject.audioPaths = audioPaths;
			audioReturnObject.audioFilesetId = get(partialNtOtAudio, [0, 'id']);
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error.message); // eslint-disable-line no-console
			}
		}
	}

	return audioReturnObject;
};
