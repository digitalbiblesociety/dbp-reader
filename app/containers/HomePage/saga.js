import { take, takeLatest, cancel, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { LOCATION_CHANGE } from 'react-router-redux';
import { GET_DPB_TEXTS } from './constants';
import { loadTexts } from './actions';

export function* getTexts() {
  // need to configure the correct request url as this one is not getting a response
  const requestUrl = `https://api.bible.build/library/volume?key=${process.env.DBP_API_KEY}&v=2`;
  try {
    const texts = yield call(request, requestUrl);
    const formattedTexts = texts.map((text) => ({
      volume_name: text.volume_name,
      dam_id: text.dam_id,
      language_name: text.language_name,
      language_iso: text.language_iso,
      language_iso_name: text.language_iso_name,
    }));
    yield put(loadTexts({ texts: formattedTexts }));
  } catch (err) {
    if (process.ENV === 'development') {
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
