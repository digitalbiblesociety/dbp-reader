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
	const reqUrl = `${
		process.env.BASE_API_ROUTE
	}/search?fileset_id=${bibleId}&dam_id=${bibleId}&key=${
		process.env.DBP_API_KEY
	}&v=4&query=${searchString}`;

	try {
		const response = yield call(request, reqUrl);
		const searchResults = response.data;

		yield put({ type: LOAD_SEARCH_RESULTS, searchResults });
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in get search results request', error); // eslint-disable-line no-console
		}
		yield put({ type: SEARCH_ERROR });
	}
}
// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(GET_SEARCH_RESULTS, getSearchResults);
}
