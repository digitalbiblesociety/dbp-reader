import { createSelector } from 'reselect';

/**
 * Direct selector to the textSelection state domain
 */
const selectTextSelectionDomain = (state) => state.get('textSelection');

/**
 * Other specific selectors
 */
const selectTexts = () => createSelector(
	selectTextSelectionDomain,
	(substate) => substate.get('texts')
);

const selectLanguages = () => createSelector(
	selectTextSelectionDomain,
	(substate) => substate.get('languages')
);

/**
 * Default selector used by TextSelection
 */

const makeSelectTextSelection = () => createSelector(
	selectTextSelectionDomain,
	(substate) => substate.toJS()
);

export default makeSelectTextSelection;
export {
	selectTextSelectionDomain,
	selectTexts,
	selectLanguages,
};
