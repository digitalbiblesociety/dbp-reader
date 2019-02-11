import { createSelector } from 'reselect';

const toJs = (state) =>
	typeof state.toJS === 'function' ? state.toJS() : state;
/**
 * Direct selector to the audioPlayer state domain
 */
const selectDefaultDomain = (state) => state.get('audioPlayer');

/**
 * Other specific selectors
 */
const selectorGenerator = (key, domain) =>
	domain
		? createSelector(
				(state) => state.get(domain),
				(selectedState) => toJs(selectedState.get(key)),
		  )
		: createSelector(selectDefaultDomain, (audio) => toJs(audio.get(key)));

const selectAutoPlay = () =>
	createSelector(
		(state) => state.get('settings'),
		(settings) => settings.getIn(['userSettings', 'autoPlayEnabled']),
	);

const selectPlaybackRate = () =>
	createSelector(
		(state) => state.get('settings'),
		(settings) => settings.getIn(['userSettings', 'playbackRate']),
	);
const selectVolume = () =>
	createSelector(
		(state) => state.get('settings'),
		(settings) => settings.getIn(['userSettings', 'volume']),
	);
/**
 * Default selector used by AudioPlayer
 */

const makeSelectAudioPlayer = () =>
	createSelector(selectDefaultDomain, (substate) => substate.toJS());

export default makeSelectAudioPlayer;
export {
	selectDefaultDomain,
	selectorGenerator,
	selectAutoPlay,
	selectPlaybackRate,
	selectVolume,
};
