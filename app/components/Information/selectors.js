import { createSelector } from 'reselect';

const selectHomepage = (state) => state.get('homepage');

const selectCopyrights = () =>
	createSelector(
		selectHomepage,
		(home) =>
			home.get('copyrights').toJS === 'function'
				? home.get('copyrights').toJS()
				: home.get('copyrights'),
	);

export { selectCopyrights };
