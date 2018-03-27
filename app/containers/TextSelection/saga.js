import { takeLatest, call, put } from 'redux-saga/effects';
// import languageList from 'utils/languagesWithResources.json';
import request from 'utils/request';
import { fromJS } from 'immutable';
import {
	GET_COUNTRIES,
	GET_DPB_TEXTS,
	GET_LANGUAGES,
	ERROR_GETTING_LANGUAGES,
	ERROR_GETTING_VERSIONS,
	CLEAR_ERROR_GETTING_VERSIONS,
	CLEAR_ERROR_GETTING_LANGUAGES,
} from './constants';
import { loadTexts, loadCountries, setLanguages } from './actions';

export function* getCountries() {
	const requestUrl = `https://api.bible.build/countries?key=${process.env.DBP_API_KEY}&v=4`;

	try {
		const response = yield call(request, requestUrl);
		const countriesObject = response.data.reduce((acc, country) => {
			const tempObj = acc;
			if (typeof country.name !== 'string') {
				tempObj[country.name.name] = { ...country, name: country.name.name };
			} else if (country.name === '') {
				return acc;
			} else {
				tempObj[country.name] = country;
			}
			return tempObj;
		}, {});

		countriesObject.ANY = { name: 'ANY', languages: { ANY: 'ANY' }, codes: { iso_a2: 'ANY' } };

		const countries = fromJS(countriesObject).sort((a, b) => {
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
			// fetch('https://api.bible.build/error_logging', options);
		}
	}
}

export function* getTexts({ languageISO }) {
	let requestUrl = '';
	if (languageISO === 'ANY') {
		requestUrl = `https://api.bible.build/bibles?key=${process.env.DBP_API_KEY}&v=4`;
	} else {
		requestUrl = `https://api.bible.build/bibles?key=${process.env.DBP_API_KEY}&language_code=${languageISO}&v=4`;
	}

	try {
		const response = yield call(request, requestUrl);
		// Some texts may have plain text in the database but no filesets
		// This filters out all texts that don't have a fileset
		const texts = response.data.filter((text) => (text.name && text.language && text.iso && text.abbr) && (Array.isArray(text.filesets) && text.filesets.length));

		yield put({ type: CLEAR_ERROR_GETTING_VERSIONS });
		yield put(loadTexts({ texts }));
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(error); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}

		yield put({ type: ERROR_GETTING_VERSIONS });
	}
}

export function* getLanguages() {
	const requestUrl = `https://api.bible.build/languages?key=${process.env.DBP_API_KEY}&v=4`;

	try {
		const response = yield call(request, requestUrl);
		// const languages = response.data.filter((language) => languageList[language.iso_code]);
		// Temporary fix until the api returns the list pre-sorted
		const languages = response.data.filter((language) => language.bible_count > 0).sort((a, b) => a.name > b.name);
		languages.unshift({ name: 'ANY', iso_code: 'ANY' });

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
			// fetch('https://api.bible.build/error_logging', options);
		}

		yield put({ type: ERROR_GETTING_LANGUAGES });
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(GET_DPB_TEXTS, getTexts);
	yield takeLatest(GET_LANGUAGES, getLanguages);
	yield takeLatest(GET_COUNTRIES, getCountries);
}
