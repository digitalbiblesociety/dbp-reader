import { take, takeLatest, cancel, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { LOCATION_CHANGE } from 'react-router-redux';
import { GET_DPB_TEXTS } from './constants';
import { loadTexts } from './actions';

export function* getTexts() {
  // need to configure the correct request url as this one is not getting a response
	const requestUrl = `https://api.bible.build/bibles?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	try {
		const response = yield call(request, requestUrl);

    yield put(loadTexts({ texts: response.data }));
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(err); // eslint-disable-line no-console
    }
  }
}
// Individual exports for testing
export default function* defaultSaga() {
	const watchTextsRequest = yield takeLatest(GET_DPB_TEXTS, getTexts);

	yield take(LOCATION_CHANGE);
	yield cancel(watchTextsRequest);
  // See example in containers/HomePage/saga.js
}
