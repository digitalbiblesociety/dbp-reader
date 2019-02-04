import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import SvgWrapper from '../SvgWrapper';
import getPreviousChapterUrl from '../../utils/getPreviousChapterUrl';
import getNextChapterUrl from '../../utils/getNextChapterUrl';

const SvgButton = ({ id, clickHandler, videoObject }) => (
	<div onClick={clickHandler} className={'control-button-container'}>
		<span className={'play-video-title'}>
			{videoObject.reference || 'Loading'}
		</span>
		<SvgWrapper className={'play-video'} fill={'#fff'} svgid={id} />
	</div>
);

SvgButton.propTypes = {
	id: PropTypes.string,
	clickHandler: PropTypes.func,
	videoObject: PropTypes.object,
};

class VideoOverlay extends React.PureComponent {
	get nextChapterAs() {
		const { books, bookId, chapter, textId, text } = this.props;

		return getNextChapterUrl({
			books,
			bookId: bookId.toLowerCase(),
			chapter,
			textId,
			text,
			isHref: false,
			vid: true,
		});
	}

	get nextChapterHref() {
		const { books, bookId, chapter, textId, text } = this.props;

		return getNextChapterUrl({
			books,
			bookId: bookId.toLowerCase(),
			chapter,
			textId,
			text,
			isHref: true,
			vid: true,
		});
	}

	get previousChapterAs() {
		const { books, bookId, chapter, textId, text } = this.props;

		return getPreviousChapterUrl({
			books,
			bookId: bookId.toLowerCase(),
			chapter,
			textId,
			text,
			isHref: false,
			vid: true,
		});
	}

	get previousChapterHref() {
		const { books, bookId, chapter, textId, text } = this.props;

		return getPreviousChapterUrl({
			books,
			bookId: bookId.toLowerCase(),
			chapter,
			textId,
			text,
			isHref: true,
			vid: true,
		});
	}

	handleNextClick = () => {
		this.props.closePlayer();
		Router.replace(this.nextChapterAs);
	};

	handlePreviousClick = () => {
		this.props.closePlayer();
		Router.replace(this.previousChapterAs);
	};

	render() {
		const {
			paused,
			currentVideo,
			previousVideo,
			nextVideo,
			playFunction,
			pauseFunction,
			previousFunction,
			nextFunction,
		} = this.props;

		return (
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
				) : (
					<SvgButton
						id={'previous_video'}
						clickHandler={this.handlePreviousClick}
						videoObject={{ reference: 'Previous Chapter' }}
					/>
				)}
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
				) : (
					<SvgButton
						id={'next_video'}
						clickHandler={this.handleNextClick}
						videoObject={{ reference: 'Next Chapter' }}
					/>
				)}
			</div>
		);
	}
}

VideoOverlay.propTypes = {
	paused: PropTypes.bool,
	currentVideo: PropTypes.object,
	nextVideo: PropTypes.object,
	previousVideo: PropTypes.object,
	playFunction: PropTypes.func,
	closePlayer: PropTypes.func,
	pauseFunction: PropTypes.func,
	nextFunction: PropTypes.func,
	previousFunction: PropTypes.func,
	books: PropTypes.array,
	bookId: PropTypes.string,
	chapter: PropTypes.number,
	textId: PropTypes.string,
	text: PropTypes.array,
};

export default VideoOverlay;
