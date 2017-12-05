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
  books: [
    {
      book_id: 'GEN',
      name: 'Genesis',
      chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    },
    {
      book_id: 'EXO',
      name: 'Exodus',
      chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
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
      return state
        .set('isBibleTableActive', false)
        .set('isBookTableActive', !state.get('isBookTableActive'));
    case TOGGLE_BIBLE_NAMES:
      return state
        .set('isBibleTableActive', !state.get('isBibleTableActive'))
        .set('isBookTableActive', false);
    default:
      return state;
  }
}

export default homePageReducer;
