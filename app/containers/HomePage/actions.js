/*
 *
 * HomePage actions
 *
 */

import {
  LOAD_TEXTS,
  GET_DPB_TEXTS,
} from './constants';

export function loadTexts({ texts }) {
  return {
    type: LOAD_TEXTS,
    texts,
  };
}

export function getTexts() {
  return {
    type: GET_DPB_TEXTS,
  };
}
