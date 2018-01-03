/**
*
* AudioPlayerMenu
*
*/

import React from 'react';
// import styled from 'styled-components';

function AudioPlayerMenu() {
	return (
		<div className="elipsis">
			<div><input type="checkbox" /><span>DRAMATIZED PREFERRED</span></div>
			<div><input type="checkbox" /><span>SYNC TEXT (BETA)</span></div>
			<div><input type="checkbox" /><span>AUTOPLAY NEXT</span></div>
			<div><input type="checkbox" /><span>AUTO HIDE/SHOW AUDIO BAR</span></div>
		</div>
	);
}

AudioPlayerMenu.propTypes = {

};

export default AudioPlayerMenu;
