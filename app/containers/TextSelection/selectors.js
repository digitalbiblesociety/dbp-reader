import { createSelector } from 'reselect';
// import { selectHomePageDomain } from 'containers/HomePage/selectors';

/**
 * Direct selector to the textSelection state domain
 */
const selectTextSelectionDomain = (state) => state.get('textSelection');
const selectHomepageDomain = (state) => state.get('homepage');
/**
 * Other specific selectors
 */
const selectHomepageData = () =>
	createSelector(selectHomepageDomain, (homepage) => ({
		activeBookName: homepage.get('activeBookName'),
		activeTextId: homepage.get('activeTextId'),
		initialIsoCode: homepage.get('defaultLanguageIso'),
		initialLanguageName: homepage.get('defaultLanguageName'),
		initialLanguageCode: homepage.get('defaultLanguageCode'),
	}));

const selectCountries = () =>
	createSelector(selectTextSelectionDomain, (substate) =>
		substate.get('countries'),
	);

const selectTexts = () =>
	createSelector(selectTextSelectionDomain, (substate) =>
		substate.get('texts'),
	);

const selectLanguages = () =>
	createSelector(selectTextSelectionDomain, (substate) => {
		const countryMap = substate.get('countries');
		const languages = substate.get('languages');
		const activeCountry = substate.get('activeCountryName');
		const activeCountryLanguages = countryMap.getIn([
			activeCountry,
			'languages',
		]);

		if (activeCountryLanguages && activeCountry !== 'ANY') {
			return languages
				.filter((language) =>
					activeCountryLanguages.includes(language.get('iso')),
				)
				.sort((a, b) => {
					if (
						activeCountryLanguages.indexOf(a.get('iso')) <
						activeCountryLanguages.indexOf(b.get('iso'))
					) {
						return -1;
					} else if (
						activeCountryLanguages.indexOf(a.get('iso')) >
						activeCountryLanguages.indexOf(b.get('iso'))
					) {
						return 1;
					} else {
						return 0;
					}
				})
				.toJS();
		}
		// If any language then keep default sort order
		return languages.toJS();
	});

/**
 * Default selector used by TextSelection
 */

const makeSelectTextSelection = () =>
	createSelector(selectTextSelectionDomain, (substate) => substate.toJS());

export default makeSelectTextSelection;
export {
	selectTextSelectionDomain,
	selectTexts,
	selectLanguages,
	selectCountries,
	selectHomepageData,
};
