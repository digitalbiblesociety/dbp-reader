import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from '../../components/SvgWrapper';

const SvgButton = ({ id, clickHandler, videoObject }) => (
	<div className={'control-button-container'}>
		<span className={'play-video-title'}>
			{videoObject.reference || 'Loading'}
		</span>
		<SvgWrapper
			onClick={clickHandler}
			className={'play-video'}
			fill={'#fff'}
			svgid={id}
		/>
	</div>
);

SvgButton.propTypes = {
	id: PropTypes.string,
	clickHandler: PropTypes.func,
	videoObject: PropTypes.object,
};

// const PlayButton = ({ playFunction, currentVideo }) => (
//   <div className={'control-button-container'}>
//     <span className={'play-video-title'}>
//       {currentVideo.reference || 'Loading'}
//     </span>
//     <SvgWrapper
//       onClick={playFunction}
//       className={'play-video'}
//       fill={'#fff'}
//       svgid={'play'}
//     />
//   </div>
// );
// PlayButton.propTypes = {
//   playFunction: PropTypes.func,
//   currentVideo: PropTypes.object,
// };

const VideoOverlay = ({
	paused,
	currentVideo,
	previousVideo,
	nextVideo,
	playFunction,
	pauseFunction,
	previousFunction,
	nextFunction,
}) => (
	<div
		className={
			paused
				? 'play-video-container show-control-icon'
				: 'play-video-container hide-control-icon'
		}
	>
		{previousVideo ? (
			<SvgButton
				id={'previous_video'}
				clickHandler={previousFunction}
				videoObject={previousVideo}
			/>
		) : null}
		{paused ? (
			<SvgButton
				id={'play_video'}
				clickHandler={playFunction}
				videoObject={currentVideo}
			/>
		) : null}
		{paused ? null : (
			<SvgButton
				id={'pause_video'}
				videoObject={currentVideo}
				clickHandler={pauseFunction}
			/>
		)}
		{nextVideo ? (
			<SvgButton
				id={'next_video'}
				clickHandler={nextFunction}
				videoObject={nextVideo}
			/>
		) : null}
	</div>
);

VideoOverlay.propTypes = {
	paused: PropTypes.bool,
	currentVideo: PropTypes.object,
	nextVideo: PropTypes.object,
	previousVideo: PropTypes.object,
	playFunction: PropTypes.func,
	pauseFunction: PropTypes.func,
	nextFunction: PropTypes.func,
	previousFunction: PropTypes.func,
};

export default VideoOverlay;
