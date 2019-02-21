/*
 *
 * AudioPlayer actions
 *
 */

import { SET_VOLUME, SET_PLAYBACK_RATE, SET_AUDIO_TYPE } from './constants';

export const setVolume = (props) => ({
	type: SET_VOLUME,
	...props,
});
export const setPlaybackRate = (props) => ({
	type: SET_PLAYBACK_RATE,
	...props,
});

export const setAudioType = (props) => ({
	type: SET_AUDIO_TYPE,
	...props,
});
