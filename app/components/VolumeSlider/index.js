/**
 *
 * VolumeSlider
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider/lib/Slider';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
// import styled from 'styled-components';
// rc-slider Slider component doesn't accept classes for styles other than classname
class VolumeSlider extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(
			this.ref,
			this.props.onCloseFunction,
			{ volume: 'volume' },
		);
		this.closeMenuController.onMenuMount();
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.ref &&
			nextProps.active &&
			nextProps.active !== this.props.active
		) {
			this.closeMenuController.onMenuUnmount();
			this.closeMenuController.onMenuMount();
		}
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setRef = (el) => (this.ref = el);

	handleChange = (value) => {
		// console.log('handling change and new volume value', value / 100 || 0);
		// this.setState({ stateVolume: value / 100 || 0 });
		this.props.updateVolume(value / 100 || 0);
	};

	render() {
		const { volume, active } = this.props;
		// const {
		// 	stateVolume,
		// } = this.state;
		// console.log('rendering volume slider');
		return (
			<div
				ref={this.setRef}
				className={
					active ? 'volume-slider-container active' : 'volume-slider-container'
				}
			>
				<div className="volume-slider">
					<Slider
						className="slider"
						onChange={this.handleChange}
						handleStyle={{
							border: 'none',
							backgroundColor: 'rgb(98,177,130)',
							top: '4px',
						}}
						railStyle={{ backgroundColor: '#111', height: '2px' }}
						trackStyle={{ backgroundColor: 'rgb(98,177,130)', height: '2px' }}
						defaultValue={volume * 100}
						min={0}
						max={100}
					/>
				</div>
			</div>
		);
	}
}

VolumeSlider.propTypes = {
	updateVolume: PropTypes.func.isRequired,
	volume: PropTypes.number.isRequired,
	onCloseFunction: PropTypes.func,
	active: PropTypes.bool,
};

export default VolumeSlider;
