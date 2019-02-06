import React from 'react';
import PropTypes from 'prop-types';
import getFormattedTimeString from '../../utils/getFormattedTimeString';
import SvgWrapper from '../SvgWrapper';

class VideoList extends React.PureComponent {
	render() {
		const {
			elipsisOpen,
			playlist,
			handleThumbnailClick,
			toggleElipsis,
		} = this.props;

		return (
			<div
				className={
					!elipsisOpen
						? 'video-elipsis-container closed'
						: 'video-elipsis-container'
				}
			>
				<div className={'video-elipsis-menu'}>
					<div className={'video-elipsis-header'}>
						<SvgWrapper className={'gospel-films'} svgid={'gospel_films'} />
						<span className={'title-text'}>Gospel Films</span>
						<SvgWrapper
							className={'close-arrow'}
							fill={'#fff'}
							onClick={toggleElipsis}
							svgid={'arrow_down'}
						/>
					</div>
					<div className={'video-thumbnail-list'}>
						<div className={'scroll-container'}>
							{playlist.map((video) => (
								<div
									className={'video-thumbnail'}
									key={`${video.id}`}
									onClick={() => handleThumbnailClick(video)}
								>
									<img
										className={'thumbnail-poster'}
										src={`${process.env.CDN_STATIC_FILES}/${video.thumbnail}`}
										alt={`There was no thumbnail for: ${video.title}`}
									/>
									<div className={'thumbnail-metadata'}>
										<span className={'thumbnail-title'}>
											{`${video.title}`}
										</span>
										<span className={'thumbnail-duration'}>
											{getFormattedTimeString(video.duration)}
										</span>
									</div>
									<SvgWrapper
										className={'thumbnail-play-button'}
										svgid={'play'}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

VideoList.propTypes = {
	elipsisOpen: PropTypes.bool,
	playlist: PropTypes.array,
	toggleElipsis: PropTypes.func,
	handleThumbnailClick: PropTypes.func,
};

export default VideoList;
