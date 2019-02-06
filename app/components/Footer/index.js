/**
 *
 * Footer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from '../SvgWrapper';

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
}) => (
	<div
		className={
			isScrollingDown ? 'footer-background closed' : 'footer-background'
		}
	>
		<div className="footer-content">
			<span
				title={'Profile'}
				id={'profile-button'}
				className={profileActive ? 'item active' : 'item'}
				role="button"
				tabIndex={0}
				onClick={() => !profileActive && toggleProfile()}
			>
				<SvgWrapper className={'icon'} fill="#fff" svgid="profile" />
				<span className={'title-text'}>Profile</span>
			</span>
			<span
				title={'Search'}
				id={'search-button'}
				className={searchActive ? 'item active' : 'item'}
				role="button"
				tabIndex={0}
				onClick={() => !searchActive && toggleSearch()}
			>
				<SvgWrapper className={'icon'} fill="#fff" svgid="search" />
				<span className={'title-text'}>Search</span>
			</span>
			<span
				title={'Notebook'}
				id={'notebook-button'}
				className={notebookActive ? 'item active' : 'item'}
				role="button"
				tabIndex={0}
				onClick={() => {
					if (!notebookActive) {
						toggleNotebook();
					}
				}}
			>
				<SvgWrapper className={'icon'} fill="#fff" svgid="notebook" />
				<span className={'title-text'}>Notebook</span>
			</span>
			<span
				title={'Settings'}
				id={'settings-button'}
				className={settingsActive ? 'item active' : 'item'}
				role="button"
				tabIndex={0}
				onClick={() => !settingsActive && toggleSettingsModal()}
			>
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
	isScrollingDown: PropTypes.bool,
	toggleNotebook: PropTypes.func,
	toggleSettingsModal: PropTypes.func,
	toggleProfile: PropTypes.func,
	toggleSearch: PropTypes.func,
};

export default Footer;
