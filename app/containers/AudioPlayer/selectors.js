import { createSelector } from 'reselect';

/**
 * Direct selector to the audioPlayer state domain
 */
const selectAudioPlayerDomain = (state) => state.get('audioPlayer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AudioPlayer
 */

const makeSelectAudioPlayer = () => createSelector(
	selectAudioPlayerDomain,
	(substate) => substate.toJS()
);

export default makeSelectAudioPlayer;
export {
	selectAudioPlayerDomain,
};
