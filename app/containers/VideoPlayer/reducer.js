import { fromJS } from 'immutable';
import { LOAD_VIDEO_LIST } from './constants';

const initialState = fromJS({
	videoList: [],
});

export default (state = initialState, action) => {
	switch (action.type) {
		case LOAD_VIDEO_LIST:
			return state.set('videoList', fromJS(action.videoList));
		default:
			return state;
	}
};
