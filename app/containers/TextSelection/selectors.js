import { createSelector } from 'reselect';
import { fromJS } from 'immutable';

/**
 * Direct selector to the textSelection state domain
 */
const selectTextSelectionDomain = (state) => state.get('textSelection');

/**
 * Other specific selectors
 */
const selectCountries = () => createSelector(
	selectTextSelectionDomain,
	(substate) => {
		const countries = substate.get('countries');
		const addAnyOption = countries.set('ANY', fromJS({ name: 'ANY', languages: { ANY: 'ANY' } }));
		const filteredCountries = addAnyOption.filter((country) => country.get('languages').size > 0);

		return filteredCountries;
	}
);

const selectTexts = () => createSelector(
	selectTextSelectionDomain,
	(substate) => substate.get('texts')
);

const selectLanguages = () => createSelector(
	selectTextSelectionDomain,
	(substate) => {
		const countryMap = substate.get('countries');
		const languages = substate.get('languages');
		const activeCountry = substate.get('activeCountryName');
		const activeCountryLanguages = countryMap.getIn([activeCountry, 'languages']);

		return activeCountry === 'ANY' ? languages : languages.filter((language) => activeCountryLanguages.has(language.get('iso_code')));
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
