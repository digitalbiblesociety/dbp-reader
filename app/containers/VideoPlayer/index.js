import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Hls from 'hls.js';
import makeSelectHomePage from '../HomePage/selectors';

class VideoPlayer extends React.PureComponent {
	state = {
		playerOpen: true,
	};

	componentDidMount() {
		this.initVideoStream();
	}

	setVideoRef = (el) => {
		this.videoRef = el;
	};

	initVideoStream = () => {
		this.hls = new Hls();
		this.hls.on(Hls.Events.ERROR, (event, data) => {
			if (data.fatal) {
				switch (data.type) {
					case Hls.ErrorTypes.NETWORK_ERROR:
						this.hls.startLoad();
						break;
					case Hls.ErrorTypes.MEDIA_ERROR:
						this.hls.recoverMediaError();
						break;
					default:
						this.hls.destroy();
						break;
				}
			}
		});
		this.hls.loadSource(
			'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
		);
		this.hls.attachMedia(this.videoRef);
		this.hls.on(Hls.Events.MANIFEST_PARSED, (/* event, data */) => {
			// console.log('Playing the video now with event and data', event, data);
			this.videoRef.play();
		});
	};

	render() {
		const { playerOpen } = this.state;
		/* eslint-disable jsx-a11y/media-has-caption */
		if (playerOpen) {
			return (
				<div
					style={{
						position: 'fixed',
						zIndex: 12,
						display: 'flex',
						width: 1000,
						height: 500,
						top: 56,
					}}
				>
					<video
						ref={this.setVideoRef}
						style={{ width: '100%', height: '100%' }}
						controls
					/>
					<div style={{ width: '100%', height: 15, backgroundColor: '#222' }}>
						<button>\/</button>
					</div>
				</div>
			);
		}
		/* eslint-enable jsx-a11y/media-has-caption */
		return (
			<div
				style={{
					width: '100%',
					position: 'fixed',
					top: 76,
					height: 15,
					backgroundColor: '#222',
				}}
			>
				<button>\/</button>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
});

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(VideoPlayer);
