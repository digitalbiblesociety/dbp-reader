/**
 *
 * AudioPlayer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ReactAudioPlayer from 'react-audio-player';
import injectReducer from 'utils/injectReducer';
import SvgWrapper from 'components/SvgWrapper';
import makeSelectAudioPlayer from './selectors';
import reducer from './reducer';

export class AudioPlayer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<div className="audio-player-container">
				<SvgWrapper className="item" width="25px" height="25px" fill="#fff" svgid="backward" />
				<SvgWrapper className="item" width="25px" height="25px" fill="#fff" svgid="play_audio" />
				<SvgWrapper className="item" width="25px" height="25px" fill="#fff" svgid="forward" />
				<SvgWrapper className="item" width="25px" height="25px" fill="#fff" svgid="volume" />
				<SvgWrapper className="item" width="25px" height="25px" fill="#fff" svgid="play_speed" />
				<SvgWrapper className="item" width="25px" height="25px" fill="#fff" svgid="more_menu" />
				<ReactAudioPlayer className="audio-player" controls src="http://cloud.faithcomesbyhearing.com/mp3audiobibles2/ENGESVO2DA/A01___01_Genesis_____ENGESVO2DA.mp3" />
			</div>
		);
	}
}

AudioPlayer.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
	audioplayer: makeSelectAudioPlayer(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'audioPlayer', reducer });

export default compose(
	withReducer,
	withConnect,
)(AudioPlayer);
