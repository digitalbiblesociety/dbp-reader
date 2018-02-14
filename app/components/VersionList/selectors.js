import { createSelector } from 'reselect';

const getErrorsState = (state) => state.get('errors');

const getVersionsError = () => createSelector(
	getErrorsState,
	(errors) => errors.get('getVersionsError')
);

export {
	getVersionsError,
};
