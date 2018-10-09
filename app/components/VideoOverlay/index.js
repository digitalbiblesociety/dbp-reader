import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from '../../components/SvgWrapper';

const PlayButton = ({ paused, playFunction }) => (
	<SvgWrapper
		onClick={playFunction}
		className={
			paused ? 'play-video show-control-icon' : 'play-video hide-control-icon'
		}
		fill={'#fff'}
		svgid={'play_video'}
		viewBox={'0 0 90 40'}
	/>
);

PlayButton.propTypes = {
	paused: PropTypes.bool,
	playFunction: PropTypes.func,
};

const NextButton = ({ paused, nextFunction }) => (
	<SvgWrapper
		onClick={nextFunction}
		className={
			paused ? 'next-video show-control-icon' : 'next-video hide-control-icon'
		}
		fill={'#fff'}
		svgid={'next'}
		viewBox={'0 0 90 40'}
	/>
);

NextButton.propTypes = {
	paused: PropTypes.bool,
	nextFunction: PropTypes.func,
};

const PreviousButton = ({ paused, previousFunction }) => (
	<SvgWrapper
		onClick={previousFunction}
		className={
			paused
				? 'previous-video show-control-icon'
				: 'previous-video hide-control-icon'
		}
		fill={'#fff'}
		svgid={'previous'}
		viewBox={'0 0 90 40'}
	/>
);

PreviousButton.propTypes = {
	paused: PropTypes.bool,
	previousFunction: PropTypes.func,
};

const VideoOverlay = ({
	paused,
	currentVideo,
	previousVideo,
	nextVideo,
	playFunction,
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
		{previousVideo && paused
			? [
					<span key={'previous_button_text'} className={'previous-video-title'}>
						{previousVideo.title || 'Loading'}
					</span>,
					<PreviousButton
						key={'previous_button_svg'}
						paused={paused}
						previousFunction={previousFunction}
					/>,
			  ]
			: null}
		<span className={'play-video-title'}>
			{currentVideo.title || 'Loading'}
		</span>
		<PlayButton paused={paused} playFunction={playFunction} />
		{nextVideo && paused
			? [
					<span key={'next_button_text'} className={'next-video-title'}>
						{nextVideo.title || 'Loading'}
					</span>,
					<NextButton
						key={'next_button_svg'}
						paused={paused}
						nextFunction={nextFunction}
					/>,
			  ]
			: null}
	</div>
);

VideoOverlay.propTypes = {
	paused: PropTypes.bool,
	currentVideo: PropTypes.object,
	nextVideo: PropTypes.object,
	previousVideo: PropTypes.object,
	playFunction: PropTypes.func,
	nextFunction: PropTypes.func,
	previousFunction: PropTypes.func,
};

export default VideoOverlay;
