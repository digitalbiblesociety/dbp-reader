/**
*
* AudioPlayerMenu
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function AudioPlayerMenu({ innerRef }) {
	return (
		<div className="elipsis">
			<div ref={innerRef} className="container">
				<div><input type="checkbox" /><span>DRAMATIZED PREFERRED</span></div>
				<div><input type="checkbox" /><span>AUTOPLAY NEXT</span></div>
				<div><input type="checkbox" /><span>AUTO HIDE/SHOW AUDIO BAR</span></div>
			</div>
		</div>
	);
}

AudioPlayerMenu.propTypes = {
	innerRef: PropTypes.func,
};

export default AudioPlayerMenu;
