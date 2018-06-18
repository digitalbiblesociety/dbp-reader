/**
 *
 * Footer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';
// Todo: Use a transition to animate the closing and opening of the footer
const Footer = ({
	settingsActive,
	profileActive,
	searchActive,
	notebookActive,
	toggleNotebook,
	toggleSettingsModal,
	toggleProfile,
	toggleSearch,
	isScrollingDown,
	setActiveNotesView,
}) => (
	<div
		className={
			isScrollingDown ? 'footer-background closed' : 'footer-background'
		}
	>
		<div className="footer-content">
			<span
				title={'Profile'}
				className={profileActive ? 'item active' : 'item'}
				role="button"
				tabIndex={0}
				onClick={() => !profileActive && toggleProfile()}
			>
				<SvgWrapper className={'icon'} fill="#fff" svgid="profile" />
				<h4 className={'title-text'}>Profile</h4>
			</span>
			<span
				title={'Search'}
				className={searchActive ? 'item active' : 'item'}
				role="button"
				tabIndex={0}
				onClick={() => !searchActive && toggleSearch()}
			>
				<SvgWrapper className={'icon'} fill="#fff" svgid="search" />
				<h4 className={'title-text'}>Search</h4>
			</span>
			<span
				title={'Notebook'}
				className={notebookActive ? 'item active' : 'item'}
				role="button"
				tabIndex={0}
				onClick={() => {
					if (!notebookActive) {
						toggleNotebook();
						setActiveNotesView('notes');
					}
				}}
			>
				<SvgWrapper className={'icon'} fill="#fff" svgid="notebook" />
				<h4 className={'title-text'}>Notebook</h4>
			</span>
			<span
				title={'Settings'}
				className={settingsActive ? 'item active' : 'item'}
				role="button"
				tabIndex={0}
				onClick={() => !settingsActive && toggleSettingsModal()}
			>
				<SvgWrapper className={'icon'} fill="#fff" svgid="text_options" />
				<h4 className={'title-text'}>Options</h4>
			</span>
		</div>
	</div>
);

Footer.propTypes = {
	settingsActive: PropTypes.bool,
	profileActive: PropTypes.bool,
	searchActive: PropTypes.bool,
	notebookActive: PropTypes.bool,
	isScrollingDown: PropTypes.bool,
	toggleNotebook: PropTypes.func,
	toggleSettingsModal: PropTypes.func,
	toggleProfile: PropTypes.func,
	toggleSearch: PropTypes.func,
	setActiveNotesView: PropTypes.func,
};

export default Footer;
