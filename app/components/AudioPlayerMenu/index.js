/**
*
* AudioPlayerMenu
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function AudioPlayerMenu({ parentNode, innerRef }) {
	const component = (
		<div className="elipsis">
			<div ref={innerRef} className="container">
				<div><input type="checkbox" /><span>DRAMATIZED PREFERRED</span></div>
				<div><input type="checkbox" /><span>AUTOPLAY NEXT</span></div>
				<div><input type="checkbox" /><span>AUTO HIDE/SHOW AUDIO BAR</span></div>
			</div>
		</div>
	);
	if (parentNode) {
		return ReactDOM.createPortal(component, parentNode);
	}
	return component;
}

AudioPlayerMenu.propTypes = {
	parentNode: PropTypes.object,
	innerRef: PropTypes.func,
};

export default AudioPlayerMenu;
