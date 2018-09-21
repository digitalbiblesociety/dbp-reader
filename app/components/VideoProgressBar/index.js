import React from 'react';
import PropTypes from 'prop-types';

class VideoProgessBar extends React.PureComponent {
	render() {
		const { currentTime, buffer, duration } = this.props;

		return (
			<div>
				{currentTime}
				{buffer}
				{duration}
			</div>
		);
	}
}

VideoProgessBar.propTypes = {
	currentTime: PropTypes.number,
	buffer: PropTypes.number,
	duration: PropTypes.number,
};

export default VideoProgessBar;
