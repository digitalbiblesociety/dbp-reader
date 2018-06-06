import { takeLatest, call, put } from 'redux-saga/effects';
import territoryCodes from 'utils/territoryCodes.json';
// import languageList from 'utils/languagesWithResources.json';
import request from 'utils/request';
import { fromJS } from 'immutable';
import {
	GET_COUNTRIES,
	GET_COUNTRY,
	GET_DPB_TEXTS,
	GET_LANGUAGES,
	ERROR_GETTING_LANGUAGES,
	ERROR_GETTING_VERSIONS,
	CLEAR_ERROR_GETTING_VERSIONS,
	CLEAR_ERROR_GETTING_LANGUAGES,
} from './constants';
import { loadTexts, loadCountries, setLanguages } from './actions';

export function* getCountries() {
	const requestUrl = `${process.env.BASE_API_ROUTE}/countries?key=${
		process.env.DBP_API_KEY
	}&v=4&bucket_id=${
		process.env.DBP_BUCKET_ID
	}&has_filesets=true&include_languages=true`;

	try {
		const response = yield call(request, requestUrl);
		const countriesObject = response.data.reduce((acc, country) => {
			const tempObj = acc;
			if (typeof country.name !== 'string') {
				tempObj[country.name.name] = { ...country, name: country.name.name };
			} else if (country.name === '' || territoryCodes[country.codes.iso_a2]) {
				return acc;
			} else {
				tempObj[country.name] = country;
			}
			return tempObj;
		}, {});
		// const countriesObject = response.data.filter((country) => !territoryCodes[country.codes.iso_a2]);

		countriesObject.ANY = {
			name: 'ANY',
			languages: { ANY: 'ANY' },
			codes: { iso_a2: 'ANY' },
		};

		const countries = fromJS(countriesObject)
			.filter((c) => c.get('name'))
			.sort((a, b) => {
				if (a.get('name') === 'ANY') {
					return -1;
				} else if (a.get('name') > b.get('name')) {
					return 1;
				} else if (a.get('name') < b.get('name')) {
					return -1;
				}
				return 0;
			});

		yield put(loadCountries({ countries }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
		}
	}
}

export function* getCountry() {
	// const requestUrl = `${process.env.BASE_API_ROUTE}/countries?key=${process.env.DBP_API_KEY}&v=4&bucket_id=${process.env.DBP_BUCKET_ID}&has_filesets=true&include_languages=true&iso=${iso}`;

	try {
		// const response = yield call(request, requestUrl);
		//
		// yield put(loadCountry({ country: response.country }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
		}
	}
}

export function* getTexts({ languageISO }) {
	let requestUrl = '';

	if (languageISO === 'ANY') {
		requestUrl = `${process.env.BASE_API_ROUTE}/bibles?&bucket_id=${
			process.env.DBP_BUCKET_ID
		}&key=${process.env.DBP_API_KEY}&v=4`;
	} else {
		requestUrl = `${process.env.BASE_API_ROUTE}/bibles?&bucket_id=${
			process.env.DBP_BUCKET_ID
		}&key=${process.env.DBP_API_KEY}&language_code=${languageISO}&v=4`;
	}

	try {
		const response = yield call(request, requestUrl);
		// Some texts may have plain text in the database but no filesets
		// This filters out all texts that don't have a fileset
		// console.log('response', response);
		/* I am getting a strange response for certain texts that are in the dbp-dev bucket. However I only get the response when I have the bucket specified. So far it is only occurring for the Melpa and Mende bibles.  If you are still working tonight I can send you more details, otherwise I can just leave it until Monday. */
		const texts = response.data.filter(
			(text) =>
				text.name &&
				text.language &&
				text.iso &&
				text.abbr &&
				(text.filesets['dbp-dev'] &&
					text.filesets['dbp-dev'].find(
						(f) =>
							f.type === 'audio' ||
							f.type === 'audio_drama' ||
							f.type === 'text_plain' ||
							f.type === 'text_format',
					)),
		);
		const mappedTexts = texts.map((text) => ({
			...text,
			filesets:
				text.filesets['dbp-dev'].filter(
					(f) =>
						f.type === 'audio' ||
						f.type === 'audio_drama' ||
						f.type === 'text_plain' ||
						f.type === 'text_format',
				) || [],
		}));
		// console.log(texts);
		// console.log('mappedTexts', mappedTexts);

		yield put({ type: CLEAR_ERROR_GETTING_VERSIONS });
		yield put(loadTexts({ texts: mappedTexts }));
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(error); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
		}

		yield put({ type: ERROR_GETTING_VERSIONS });
	}
}

export function* getLanguages() {
	const requestUrl = `${process.env.BASE_API_ROUTE}/languages?key=${
		process.env.DBP_API_KEY
	}&v=4&bucket_id=${process.env.DBP_BUCKET_ID}&has_filesets=true`;

	try {
		const response = yield call(request, requestUrl);
		// const languages = response.data.filter((language) => languageList[language.iso_code]);
		// console.log(response.data.filter((l) => l.name === 'Ma\'di South' || l.iso === 'snm'));
		// Temporary fix until the api returns the list pre-sorted
		// const languages = response.data.filter((language) => language.bibles > 0).sort((a, b) => a.name > b.name);
		const languages = response.data;
		languages.unshift({ name: 'ANY', iso: 'ANY' });
		// console.log('languages', languages);
		yield put(setLanguages({ languages }));
		yield put({ type: CLEAR_ERROR_GETTING_LANGUAGES });
		// yield put(setLanguages({ languages: response.data }));
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(error); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
		}

		yield put({ type: ERROR_GETTING_LANGUAGES });
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(GET_DPB_TEXTS, getTexts);
	yield takeLatest(GET_COUNTRY, getCountry);
	yield takeLatest(GET_LANGUAGES, getLanguages);
	yield takeLatest(GET_COUNTRIES, getCountries);
}
