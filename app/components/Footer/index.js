/**
*
* Footer
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

const Footer = ({
	settingsActive,
	profileActive,
	searchActive,
	notebookActive,
	toggleNotebook,
	toggleSettingsModal,
	toggleProfile,
	toggleSearch,
	setActiveNotesView,
}) => (
	<div className={'footer-background'}>
		<div className="footer-content">
			<span title={'Profile'} className={profileActive ? 'item active' : 'item'} role="button" tabIndex={0} onClick={() => !profileActive && toggleProfile()}>
				<SvgWrapper className={'icon'} fill="#fff" svgid="profile" />
				<span className={'title-text'}>Profile</span>
			</span>
			<span title={'Search'} className={searchActive ? 'item active' : 'item'} role="button" tabIndex={0} onClick={() => !searchActive && toggleSearch()}>
				<SvgWrapper className={'icon'} fill="#fff" svgid="search" />
				<span className={'title-text'}>Search</span>
			</span>
			<span title={'Notebook'} className={notebookActive ? 'item active' : 'item'} role="button" tabIndex={0} onClick={() => { if (!notebookActive) { toggleNotebook(); setActiveNotesView('notes'); } }}>
				<SvgWrapper className={'icon'} fill="#fff" svgid="notebook" />
				<span className={'title-text'}>Notebook</span>
			</span>
			<span title={'Settings'} className={settingsActive ? 'item active' : 'item'} role="button" tabIndex={0} onClick={() => !settingsActive && toggleSettingsModal()}>
				<SvgWrapper className={'icon'} fill="#fff" svgid="text_options" />
				<span className={'title-text'}>Options</span>
			</span>
		</div>
	</div>
);

Footer.propTypes = {
	settingsActive: PropTypes.bool,
	profileActive: PropTypes.bool,
	searchActive: PropTypes.bool,
	notebookActive: PropTypes.bool,
	toggleNotebook: PropTypes.func,
	toggleSettingsModal: PropTypes.func,
	toggleProfile: PropTypes.func,
	toggleSearch: PropTypes.func,
	setActiveNotesView: PropTypes.func,
};

export default Footer;
