import { createSelector } from 'reselect';
import { selectNotesDomain } from '../Notes/selectors';

const selectVideoDomain = (state) => state.get('videoPlayer');
const selectHomepageDomain = (state) => state.get('homepage');

const selectPlayerOpenState = () =>
	createSelector(selectHomepageDomain, (home) => home.get('videoPlayerOpen'));

const selectVideoList = () =>
	createSelector(selectVideoDomain, (videoState) =>
		videoState
			.get('videoList')
			.map((video) => ({
				title: `${video.get('book_name')} ${video.get('chapter_start')}`,
				id: `${video.get('book_id')}_${video.get('chapter_start')}_${video.get(
					'verse_start',
				)}`,
				source: video.get('path'),
				duration: video.get('duration'),
			}))
			.toJS(),
	);

const selectHasVideo = () =>
	createSelector(
		(state) => state.get('homepage'),
		(home) => home.get('hasVideo'),
	);

const makeSelectVideo = () =>
	createSelector(selectNotesDomain, (substate) => substate.toJS());

export default makeSelectVideo;

export { selectVideoList, selectHasVideo, selectPlayerOpenState };
