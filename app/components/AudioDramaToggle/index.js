/**
 *
 * AudioDramaToggle
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import {
	selectAudioType,
	selectAvailableAudioTypes,
} from '../../containers/HomePage/selectors';
import { setAudioType } from '../../containers/AudioPlayer/actions';

export class AudioDramaToggle extends React.PureComponent {
	setTypeToDrama = () => {
		this.props.dispatch(setAudioType({ audioType: 'audio_drama' }));
		// Set window location param to correct query string
		if (history.replaceState) {
			const search = '?audio_type=audio_drama';
			const newPath = `${location.origin}${location.pathname}${search}`;
			history.replaceState(null, '', newPath);
		}
	};

	setTypeToNonDrama = () => {
		this.props.dispatch(setAudioType({ audioType: 'audio' }));
		// Set window location param to correct query string
		if (history.replaceState) {
			const search = '?audio_type=audio';
			const newPath = `${location.origin}${location.pathname}${search}`;
			history.replaceState(null, '', newPath);
		}
	};

	classNames = (elementType) => {
		const { audioType, availableAudioTypes } = this.props;
		let className = 'audio-drama-toggle-button';
		if (audioType === elementType) {
			className += ' active';
		}
		if (!availableAudioTypes.includes(elementType)) {
			className += ' disabled';
		}
		return className;
	};

	render() {
		return (
			<div className={'audio-drama-toggle-container'}>
				<button
					type={'button'}
					id={'drama-button'}
					className={this.classNames('audio_drama')}
					onClick={this.setTypeToDrama}
				>
					Drama
				</button>
				<button
					type={'button'}
					id={'non-drama-button'}
					className={this.classNames('audio')}
					onClick={this.setTypeToNonDrama}
				>
					Non-Drama
				</button>
			</div>
		);
	}
}

AudioDramaToggle.propTypes = {
	dispatch: PropTypes.func.isRequired,
	audioType: PropTypes.string.isRequired,
	availableAudioTypes: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
	audioType: selectAudioType(),
	availableAudioTypes: selectAvailableAudioTypes(),
});

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AudioDramaToggle);
