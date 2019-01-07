import { createSelector } from 'reselect';
const selectHomepage = (state) => state.get('homepage');
const selectIeState = () =>
	createSelector(selectHomepage, (homepage) => homepage.get('isIe'));

export { selectIeState };
