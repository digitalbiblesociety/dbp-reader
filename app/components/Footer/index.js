/**
*
* Footer
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

function Footer({ isInformationModalActive, toggleProfile, settingsActive, toggleSettingsModal, toggleInformationModal }) {
	return (
		<div className="footer">
			<div className="left-buttons">
				<span className="item" role="button" tabIndex={0} onClick={() => !isInformationModalActive && toggleInformationModal()}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="info" /></span>
				<span className="item" role="button" tabIndex={0} onClick={() => !settingsActive && toggleSettingsModal()}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="settings" /></span>
			</div>
			<div className="right-buttons">
				<span className="item"><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="upload" /></span>
				<span className="small-show medium-hide button" role="button" tabIndex={0} onClick={toggleProfile}><SvgWrapper height="30px" width="30px" fill="#fff" svgid="profile_circle" /></span>
			</div>
		</div>
	);
}

Footer.propTypes = {
	toggleProfile: PropTypes.func,
	toggleSettingsModal: PropTypes.func,
	toggleInformationModal: PropTypes.func,
	isInformationModalActive: PropTypes.bool,
	settingsActive: PropTypes.bool,
};

export default Footer;
