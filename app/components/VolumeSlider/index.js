/**
 *
 * VolumeSlider
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider/lib/Slider';
import CloseMenuFunctions from '../../utils/closeMenuFunctions';
import Colors from '../../utils/javascriptColors';

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
		this.props.updateVolume(value / 100 || 0);
	};

	get activeClassName() {
		return this.props.activeClassNames || 'volume-slider-container active';
	}

	get inactiveClassName() {
		return this.props.inactiveClassNames || 'volume-slider-container';
	}

	get railStyle() {
		return this.props.railStyle || { backgroundColor: '#111', height: '2px' };
	}

	get trackStyle() {
		return (
			this.props.trackStyle || {
				backgroundColor: Colors.sliderGreen,
				height: '2px',
			}
		);
	}

	get handleStyle() {
		return (
			this.props.handleStyle || {
				border: 'none',
				backgroundColor: Colors.sliderGreen,
				top: '4px',
			}
		);
	}

	render() {
		const {
			volume,
			active,
			vertical,
			sliderClassName,
			sliderContainerClassName,
		} = this.props;

		return (
			<div
				ref={this.setRef}
				className={active ? this.activeClassName : this.inactiveClassName}
			>
				<div className={sliderContainerClassName || 'volume-slider'}>
					<Slider
						className={sliderClassName || 'slider'}
						onChange={this.handleChange}
						handleStyle={this.handleStyle}
						railStyle={this.railStyle}
						trackStyle={this.trackStyle}
						defaultValue={volume * 100}
						value={volume * 100}
						vertical={vertical}
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
	onCloseFunction: PropTypes.func,
	volume: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	active: PropTypes.bool,
	vertical: PropTypes.bool,
	railStyle: PropTypes.object,
	trackStyle: PropTypes.object,
	handleStyle: PropTypes.object,
	activeClassNames: PropTypes.string,
	inactiveClassNames: PropTypes.string,
	sliderClassName: PropTypes.string,
	sliderContainerClassName: PropTypes.string,
};

export default VolumeSlider;
