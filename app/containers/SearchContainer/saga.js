import { takeLatest, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import {
	GET_SEARCH_RESULTS,
	LOAD_SEARCH_RESULTS,
	SEARCH_ERROR,
} from './constants';

// Todo: Switch to using fileset id for the search
export function* getSearchResults({ bibleId, searchText }) {
	const searchString = searchText.trim().replace(' ', '+');
	// console.log('Search string', searchString);
	// console.log('encoded Search string', encodeURI(searchString));
	// console.log('decoded Search string', decodeURI(encodeURI(searchString)));

	// ${process.env.BASE_API_ROUTE}/search?key=e582134c-8773-4e8a-b3b4-3f2493fc5127&v=4&query=god+loved+world&dam_id=ENGKJV&pretty
	const reqUrl = `${
		process.env.BASE_API_ROUTE
	}/search?fileset_id=${bibleId}&dam_id=${bibleId}&key=${
		process.env.DBP_API_KEY
	}&v=4&query=${searchString}`;

	// console.log(searchString, 'searchString');
	// console.log(reqUrl, 'reqUrl');
	try {
		const response = yield call(request, reqUrl);
		const searchResults = response.data;

		// console.log(searchResults, 'searchResults');
		// console.log('res', res);
		yield put({ type: LOAD_SEARCH_RESULTS, searchResults });
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in get search results request', error); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('${process.env.BASE_API_ROUTE}/error_logging', options);
		}
		yield put({ type: SEARCH_ERROR });
	}
}
// Individual exports for testing
export default function* defaultSaga() {
	// See example in containers/HomePage/saga.js
	yield takeLatest(GET_SEARCH_RESULTS, getSearchResults);
}
