/**
*
* Footer
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

function Footer({ toggleSettingsModal, toggleNotesModal }) {
	return (
		<div className="footer">
			<div className="left-buttons">
				<span className="item" role="button" tabIndex={0} onClick={toggleNotesModal}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="info" /></span>
				<span className="item" role="button" tabIndex={0} onClick={toggleSettingsModal}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="settings" /></span>
			</div>
			<div className="right-buttons">
				<span className="item"><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="share" /></span>
			</div>
		</div>
	);
}

Footer.propTypes = {
	toggleSettingsModal: PropTypes.func,
	toggleNotesModal: PropTypes.func,
};

export default Footer;
