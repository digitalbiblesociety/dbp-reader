/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
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
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default homePageReducer;
