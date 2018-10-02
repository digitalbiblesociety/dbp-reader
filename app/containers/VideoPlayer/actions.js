import {
	OPEN_VIDEO_PLAYER,
	CLOSE_VIDEO_PLAYER,
	GET_VIDEO_LIST,
	SET_HAS_VIDEO,
} from './constants';

export const openVideoPlayer = (props) => ({
	...props,
	type: OPEN_VIDEO_PLAYER,
});

export const closeVideoPlayer = (props) => ({
	...props,
	type: CLOSE_VIDEO_PLAYER,
});

export const getVideoList = (props) => ({
	...props,
	type: GET_VIDEO_LIST,
});

export const setHasVideo = (props) => ({
	...props,
	type: SET_HAS_VIDEO,
});
