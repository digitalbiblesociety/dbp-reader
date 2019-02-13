import request from '../../../utils/request';

export function itemsParser(
	bibles,
	activeTextId,
	filterText,
	filter,
	handleVersionListClick,
) {
	const filteredBibles = filterText ? bibles.filter(filter) : bibles;
	// Change the way I figure out if a resource has text or audio
	// path, key, types, className, text, clickHandler
	// Set the path to just the bible_id and let app.js handle getting the actual book and chapter needed
	const scrubbedBibles = filteredBibles.reduce(
		(acc, bible) => [
			...acc,
			{
				path: `/${bible.get('abbr').toUpperCase()}`,
				key: `${bible.get('abbr')}${bible.get('date')}`,
				clickHandler: (audioType) => handleVersionListClick(bible, audioType),
				className: bible.get('abbr') === activeTextId ? 'active-version' : '',
				title: bible.get('name'),
				text: bible.get('vname') || bible.get('name') || bible.get('abbr'),
				altText:
					bible.get('vname') && bible.get('vname') !== bible.get('name')
						? bible.get('name')
						: '',
				types: bible
					.get('filesets')
					.reduce((a, c) => ({ ...a, [c.get('type')]: true }), {}),
			},
		],
		[],
	);
	// When I first get the response from the server with filesets
	const audioAndText = [];
	const audioOnly = [];
	const textOnly = [];

	scrubbedBibles.forEach((b) => {
		if (
			(b.types.audio_drama || b.types.audio) &&
			(b.types.text_plain || b.types.text_format)
		) {
			audioAndText.push(b);
		} else if (b.types.audio_drama || b.types.audio) {
			audioOnly.push(b);
		} else {
			textOnly.push(b);
		}
	});
	if (audioAndText.length) {
		return audioAndText;
	} else if (audioOnly.length) {
		return audioOnly;
	}
	return textOnly;
}

export function filterFunction(bible) {
	const lowerCaseText = this.props.filterText.toLowerCase();
	const abbr = bible.get('abbr') || '';
	const name = bible.get('name') || '';
	const vname = bible.get('vname') || '';
	const date = bible.get('date') || '';

	if (vname.toLowerCase().includes(lowerCaseText)) {
		return true;
	} else if (name.toLowerCase().includes(lowerCaseText)) {
		return true;
	} else if (abbr.toLowerCase().includes(lowerCaseText)) {
		return true;
	} else if (date.includes(lowerCaseText)) {
		return true;
	}
	return false;
}

export async function getTexts({ languageCode }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/bibles?asset_id=${
		process.env.DBP_BUCKET_ID
	}&key=${process.env.DBP_API_KEY}&language_code=${languageCode}&v=4`;
	const videoRequestUrl = `${
		process.env.BASE_API_ROUTE
	}/bibles?asset_id=dbp-vid&key=${
		process.env.DBP_API_KEY
	}&language_code=${languageCode}&v=4`;
	// Put logic here for determining what url to direct to when user chooses new version
	// Benefits are that all the information can be gathered up front and behind a clear
	// loading spinner
	// Negatives are that the list of versions would take longer to load

	try {
		const response = await request(requestUrl);
		const videoRes = await request(videoRequestUrl);
		// Some texts may have plain text in the database but no filesets
		// This filters out all texts that don't have a fileset
		const videos = videoRes.data.filter(
			(video) => video.abbr && video.language && video.language_id && video.iso,
		);

		const texts = response.data.filter(
			(text) =>
				text.iso &&
				text.abbr &&
				(text.filesets[process.env.DBP_BUCKET_ID] &&
					text.filesets[process.env.DBP_BUCKET_ID].find(
						(f) =>
							f.type === 'audio' ||
							f.type === 'audio_drama' ||
							f.type === 'text_plain' ||
							f.type === 'text_format',
					)),
		);
		// Create map of videos for constant time lookup when iterating through the texts
		const videosMap = videos.reduce((a, c) => ({ ...a, [c.abbr]: c }), {});
		// Find any overlapping bibles between the videos and texts
		// Combine the filesets for only those overlapping bibles
		const mappedTexts = texts.map((text) => ({
			...text,
			filesets: videosMap[text.abbr]
				? [
						...text.filesets[process.env.DBP_BUCKET_ID].filter(
							(f) =>
								f.type === 'audio' ||
								f.type === 'audio_drama' ||
								f.type === 'text_plain' ||
								f.type === 'text_format',
						),
						...videosMap[text.abbr].filesets['dbp-vid'],
				  ] || []
				: text.filesets[process.env.DBP_BUCKET_ID].filter(
						(f) =>
							f.type === 'audio' ||
							f.type === 'audio_drama' ||
							f.type === 'text_plain' ||
							f.type === 'text_format',
				  ) || [],
		}));

		return mappedTexts;
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(error); // eslint-disable-line no-console
		}

		return [];
	}
}
