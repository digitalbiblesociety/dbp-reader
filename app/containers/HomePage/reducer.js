/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  LOAD_TEXTS,
  TOGGLE_BIBLE_NAMES,
  TOGGLE_BOOK_NAMES,
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
  isBibleTableActive: false,
  activeTextName: 'ESV',
  isBookTableActive: false,
});

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_TEXTS:
      return state.set('texts', fromJS(action.texts));
    case TOGGLE_BOOK_NAMES:
      return state.set('isBookTableActive', !state.get('isBookTableActive'));
    case TOGGLE_BIBLE_NAMES:
      return state.set('isBibleTableActive', !state.get('isBibleTableActive'));
    default:
      return state;
  }
}

export default homePageReducer;
