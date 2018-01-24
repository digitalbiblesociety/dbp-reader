/**
*
* AudioPlayerMenu
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function AudioPlayerMenu({ parentNode, setInnerRef }) {
	const component = (
		<div className="elipsis">
			<div ref={setInnerRef} className="container">
				<div><input type="checkbox" /><span>DRAMATIZED PREFERRED</span></div>
				<div><input type="checkbox" /><span>SYNC TEXT (BETA)</span></div>
				<div><input type="checkbox" /><span>AUTOPLAY NEXT</span></div>
				<div><input type="checkbox" /><span>AUTO HIDE/SHOW AUDIO BAR</span></div>
			</div>
		</div>
	);
	return ReactDOM.createPortal(component, parentNode);
}

AudioPlayerMenu.propTypes = {
	parentNode: PropTypes.node,
	setInnerRef: PropTypes.func,
};

export default AudioPlayerMenu;
