// import { takeLatest, call, put } from 'redux-saga/effects';
// import request from 'utils/request';
// import { GET_BOOKS } from './constants';
// import { loadBooksAndCopywrite } from './actions';
//
// export function* getBooks({ textId }) {
// 	const requestUrl = `${process.env.BASE_API_ROUTE}/bibles/${textId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;
//
// 	try {
// 		const response = yield call(request, requestUrl);
// 		const books = response.data.books.map((book) => ({
// 			...book,
// 			chapters: book.chapters.split(',').map(Number),
// 		}));
//
// 		yield put(loadBooksAndCopywrite({ books }));
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-disable-line no-console
// 		}
// 	}
// }
// Individual exports for testing
export default function* defaultSaga() {
	// yield takeLatest(GET_BOOKS, getBooks);
}
