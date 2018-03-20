/**
*
* Footer
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

function Footer({ toggleProfile, settingsActive, toggleSettingsModal }) {
	return (
		<div className={'footer-background'}>
			<div className="footer-content">
				<span title={'Profile'} className="item" role="button" tabIndex={0} onClick={toggleProfile}>
					<SvgWrapper className={'icon'} fill="#fff" svgid="profile" />
					<span className={'title-text'}>Profile</span>
				</span>
				<span title={'Search'} className="item">
					<SvgWrapper className={'icon'} fill="#fff" svgid="search" />
					<span className={'title-text'}>Search</span>
				</span>
				<span title={'Information'} className="item" role="button" tabIndex={0}>
					<SvgWrapper className={'icon'} fill="#fff" svgid="notebook" />
					<span className={'title-text'}>Notebook</span>
				</span>
				<span title={'Settings'} className="item" role="button" tabIndex={0} onClick={() => !settingsActive && toggleSettingsModal()}>
					<SvgWrapper className={'icon'} fill="#fff" svgid="text_options" />
					<span className={'title-text'}>Options</span>
				</span>
			</div>
		</div>
	);
}

Footer.propTypes = {
	toggleProfile: PropTypes.func,
	toggleSettingsModal: PropTypes.func,
	settingsActive: PropTypes.bool,
};

export default Footer;
