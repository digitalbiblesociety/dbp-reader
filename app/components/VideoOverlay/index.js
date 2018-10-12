import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from '../../components/SvgWrapper';

const PlayButton = ({ playFunction }) => (
	<SvgWrapper
		onClick={playFunction}
		className={'play-video'}
		fill={'#fff'}
		svgid={'play_video'}
		viewBox={'0 0 90 40'}
	/>
);

PlayButton.propTypes = {
	playFunction: PropTypes.func,
};

const PauseButton = ({ pauseFunction }) => (
	<SvgWrapper
		onClick={pauseFunction}
		className={'play-video'}
		fill={'#fff'}
		svgid={'pause'}
		viewBox={'0 0 90 40'}
	/>
);

PauseButton.propTypes = {
	pauseFunction: PropTypes.func,
};

const NextButton = ({ nextFunction }) => (
	<SvgWrapper
		onClick={nextFunction}
		className={'next-video'}
		fill={'#fff'}
		svgid={'next'}
		viewBox={'0 0 90 40'}
	/>
);

NextButton.propTypes = {
	nextFunction: PropTypes.func,
};

const PreviousButton = ({ previousFunction }) => (
	<SvgWrapper
		onClick={previousFunction}
		className={'previous-video'}
		fill={'#fff'}
		svgid={'previous'}
		viewBox={'0 0 90 40'}
	/>
);

PreviousButton.propTypes = {
	previousFunction: PropTypes.func,
};

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
		{previousVideo
			? [
					<span key={'previous_button_text'} className={'previous-video-title'}>
						{previousVideo.reference || 'Loading'}
					</span>,
					<PreviousButton
						key={'previous_button_svg'}
						previousFunction={previousFunction}
					/>,
			  ]
			: null}
		<span className={'play-video-title'}>
			{currentVideo.reference || 'Loading'}
		</span>
		{paused ? <PlayButton playFunction={playFunction} /> : null}
		{paused ? null : <PauseButton pauseFunction={pauseFunction} />}
		{nextVideo
			? [
					<span key={'next_button_text'} className={'next-video-title'}>
						{nextVideo.reference || 'Loading'}
					</span>,
					<NextButton key={'next_button_svg'} nextFunction={nextFunction} />,
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
	pauseFunction: PropTypes.func,
	nextFunction: PropTypes.func,
	previousFunction: PropTypes.func,
};

export default VideoOverlay;
