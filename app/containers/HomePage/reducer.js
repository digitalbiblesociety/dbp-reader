/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  LOAD_TEXTS,
} from './constants';

const initialState = fromJS({
  texts: [
    {
      volume_name: 'English Standard Version',
      dam_id: 'ENGESVO2ET',
      language_name: 'ESV',
      language_iso: 'eng',
      language_iso_name: 'English',
    },
  ],
  versionSelectActive: false,
  activeTextName: 'ESV',
});

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_TEXTS:
      return state.set('texts', fromJS(action.texts));
    default:
      return state;
  }
}

export default homePageReducer;
