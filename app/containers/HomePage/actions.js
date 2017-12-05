/*
 *
 * HomePage actions
 *
 */

import {
  LOAD_TEXTS,
  GET_DPB_TEXTS,
  TOGGLE_BIBLE_NAMES,
  TOGGLE_BOOK_NAMES,
} from './constants';

export const loadTexts = ({ texts }) => ({
  type: LOAD_TEXTS,
  texts,
});

export const getTexts = () => ({
  type: GET_DPB_TEXTS,
});

export const toggleBookNames = () => ({
  type: TOGGLE_BOOK_NAMES,
});

export const toggleBibleNames = () => ({
  type: TOGGLE_BIBLE_NAMES,
});
