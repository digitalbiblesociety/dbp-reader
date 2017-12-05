import { createSelector } from 'reselect';

/**
 * Direct selector to the homepage state domain
 */
const selectHomePageDomain = (state) => state.get('homepage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by HomePage
 */

const makeSelectHomePage = () => createSelector(
  selectHomePageDomain,
  (substate) => substate
);

export default makeSelectHomePage;
export {
  selectHomePageDomain,
};
