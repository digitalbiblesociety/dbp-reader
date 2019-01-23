import {
  getSearchResults,
  addSearchTerm,
  viewError,
  stopLoading,
  startLoading,
} from '../actions';
import {
  GET_SEARCH_RESULTS,
  ADD_SEARCH_TERM,
  VIEW_ERROR,
  STOP_LOADING,
  START_LOADING,
} from '../constants';

describe('SearchContainer actions', () => {
  describe('Get search results action', () => {
    it('has a type of GET_SEARCH_RESULTS', () => {
      const expected = {
        type: GET_SEARCH_RESULTS,
      };
      expect(getSearchResults()).toEqual(expected);
    });
  });
  describe('Add search term', () => {
    it('has a type of ADD_SEARCH_TERM', () => {
      const expected = {
        type: ADD_SEARCH_TERM,
      };
      expect(addSearchTerm()).toEqual(expected);
    });
  });
  describe('View error', () => {
    it('has a type of VIEW_ERROR', () => {
      const expected = {
        type: VIEW_ERROR,
      };
      expect(viewError()).toEqual(expected);
    });
  });
  describe('Stop loading', () => {
    it('has a type of STOP_LOADING', () => {
      const expected = {
        type: STOP_LOADING,
      };
      expect(stopLoading()).toEqual(expected);
    });
  });
  describe('Start loading', () => {
    it('has a type of START_LOADING', () => {
      const expected = {
        type: START_LOADING,
      };
      expect(startLoading()).toEqual(expected);
    });
  });
});
