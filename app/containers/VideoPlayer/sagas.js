import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_VIDEO_LIST, LOAD_VIDEO_LIST } from './constants';
import request from '../../utils/request';

export function* getVideos({ filesetId = 'FALTBLP2DV', bookId = 'MRK' }) {
	const requestUrl = `https://api.dbp4.org/bibles/filesets/${filesetId}?key=${
		process.env.DBP_API_KEY
	}&v=4&type=video_stream&bucket=dbp-vid&book_id=${bookId}`;

	try {
		const response = yield call(request, requestUrl);

		if (response.data) {
			yield put({ type: LOAD_VIDEO_LIST, videoList: response.data });
		} else {
			yield put({ type: LOAD_VIDEO_LIST, videoList: [] });
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error getting video playlist', err); // eslint-disable-line no-console
		}
	}
}

export default function* defaultSaga() {
	yield takeLatest(GET_VIDEO_LIST, getVideos);
}
