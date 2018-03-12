/**
*
* AudioPlayerMenu
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

class AudioPlayerMenu extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			autoPlayChecked: this.props.autoPlay,
			dramatizedChecked: this.props.dramatized,
			autoHideChecked: this.props.autoHide,
		};
	}

	handleAutoPlayChange = (e) => {
		this.setState({ autoPlayChecked: e.target.checked });
		this.props.toggleAutoPlay();
	}

	render() {
		const { innerRef } = this.props;
		return (
			<div className="elipsis">
				<div ref={innerRef} className="container">
					<div>
						<input
							id={'dramatized'}
							className={'custom-checkbox'}
							type="checkbox"
						/>
						<label htmlFor={'dramatized'}>DRAMATIZED PREFERRED</label>
					</div>
					<div>
						<input
							id={'autoplay'}
							className={'custom-checkbox'}
							type="checkbox"
							onChange={this.handleAutoPlayChange}
							defaultChecked={this.state.autoPlayChecked}
						/>
						<label htmlFor={'autoplay'}>AUTOPLAY NEXT</label>
					</div>
					<div>
						<input
							id={'auto-hide'}
							className={'custom-checkbox'}
							type="checkbox"
						/>
						<label htmlFor={'auto-hide'}>AUTO HIDE/SHOW AUDIO BAR</label>
					</div>
				</div>
			</div>
		);
	}
}

AudioPlayerMenu.propTypes = {
	innerRef: PropTypes.func,
	toggleAutoPlay: PropTypes.func,
	autoPlay: PropTypes.bool,
	autoHide: PropTypes.bool,
	dramatized: PropTypes.bool,
};

export default AudioPlayerMenu;
