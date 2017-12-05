import { createSelector } from 'reselect';

/**
 * Direct selector to the homepage state domain
 */
const selectHomePageDomain = (state) => state.get('homepage');

/**
 * Other specific selectors
 */
const selectTextTitles = () => createSelector(
  selectHomePageDomain,
  (substate) => substate.get('texts').map((text) => text.get('language_name')).toJS()
);

/**
 * Default selector used by HomePage
 */

const makeSelectHomePage = () => createSelector(
  selectHomePageDomain,
  (substate) => substate.toJS()
);

export default makeSelectHomePage;
export {
  selectHomePageDomain,
  selectTextTitles,
};
