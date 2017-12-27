import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import countries from 'utils/parsedCountries.json';

/**
 * Direct selector to the textSelection state domain
 */
const selectTextSelectionDomain = (state) => state.get('textSelection');

/**
 * Other specific selectors
 */
const selectCountries = () => createSelector(
	() => fromJS(countries)
);

const selectTexts = () => createSelector(
	selectTextSelectionDomain,
	(substate) => substate.get('texts')
);

const selectLanguages = () => createSelector(
	selectTextSelectionDomain,
	(substate) => {
		const countryMap = fromJS(countries);
		const languages = substate.get('languages');
		const activeCountry = substate.get('activeCountryName');
		const activeCountryLanguages = countryMap.getIn([activeCountry, 'languages']);
		return languages.filter((language) => activeCountryLanguages[language.get('iso_code')]);
	}
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
	selectCountries,
};
