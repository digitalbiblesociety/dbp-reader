import { createSelector } from 'reselect';

/**
 * Direct selector to the profile state domain
 */
const selectProfileDomain = (state) => state.get('profile');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Profile
 */

const makeSelectProfile = () => createSelector(
	selectProfileDomain,
	(substate) => substate.toJS()
);

export default makeSelectProfile;
export {
	selectProfileDomain,
};
