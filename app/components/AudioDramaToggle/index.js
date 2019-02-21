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
	setAudioType = (e) => {
		const type = e.target.value;

		if (type !== this.props.audioType) {
			this.props.dispatch(setAudioType({ audioType: type }));
			// Set window location param to correct query string
			if (history.replaceState) {
				const search = `?audio_type=${type}`;
				const newPath = `${location.origin}${location.pathname}${search}`;
				history.replaceState(null, '', newPath);
			}
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

	buttonComponent = ({ id, audioType, title }) => (
		<button
			type={'button'}
			id={id}
			title={title}
			value={audioType}
			className={this.classNames(audioType)}
			onClick={this.setAudioType}
		>
			{title}
		</button>
	);

	render() {
		return (
			<div className={'audio-drama-toggle-container'}>
				{this.buttonComponent({
					id: 'drama-button',
					audioType: 'audio_drama',
					title: 'Drama',
				})}
				{this.buttonComponent({
					id: 'non-drama-button',
					audioType: 'audio',
					title: 'Non-Drama',
				})}
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
