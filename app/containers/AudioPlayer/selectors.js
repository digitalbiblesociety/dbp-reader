import { createSelector } from 'reselect';

/**
 * Direct selector to the audioPlayer state domain
 */
const selectAudioPlayerDomain = (state) => state.get('audioPlayer');
const selectHomepageDomain = (state) => state.get('homepage');

/**
 * Other specific selectors
 */
const selectHasAudio = () =>
	createSelector(selectHomepageDomain, (home) => home.get('hasAudio'));

/**
 * Default selector used by AudioPlayer
 */

const makeSelectAudioPlayer = () =>
	createSelector(selectAudioPlayerDomain, (substate) => substate.toJS());

export default makeSelectAudioPlayer;
export { selectAudioPlayerDomain, selectHasAudio };
