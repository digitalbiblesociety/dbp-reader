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
				<div><input id={'dramatized'} className={'custom-checkbox'} type="checkbox" /><label htmlFor={'dramatized'}>DRAMATIZED PREFERRED</label></div>
				<div><input id={'autoplay'} className={'custom-checkbox'} type="checkbox" /><label htmlFor={'autoplay'}>AUTOPLAY NEXT</label></div>
				<div><input id={'auto-hide'} className={'custom-checkbox'} type="checkbox" /><label htmlFor={'auto-hide'}>AUTO HIDE/SHOW AUDIO BAR</label></div>
			</div>
		</div>
	);
}

AudioPlayerMenu.propTypes = {
	innerRef: PropTypes.func,
};

export default AudioPlayerMenu;
