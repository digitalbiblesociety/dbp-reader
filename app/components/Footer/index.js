/**
 *
 * Footer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
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
	scrolledToBottom,
	theme,
	userAgent,
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
				<span className={'title-text'}>Profile</span>
			</span>
			<span
				title={'Search'}
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
				<span className={'title-text'}>Notebook</span>
			</span>
			<span
				title={'Settings'}
				className={settingsActive ? 'item active' : 'item'}
				role="button"
				tabIndex={0}
				onClick={() => !settingsActive && toggleSettingsModal()}
			>
				<SvgWrapper className={'icon'} fill="#fff" svgid="text_options" />
				<span className={'title-text'}>Options</span>
			</span>
		</div>
		<div
			className={scrolledToBottom ? 'footer-about-content' : 'footer-autohide'}
		>
			<div className={'logo-container'}>
				<a
					className="logo"
					href={'http://www.bible.is'}
					title={'http://www.bible.is'}
					target={'_blank'}
					rel={'noopener'}
				>
					{theme === 'paper' && userAgent !== 'ms' ? (
						<SvgWrapper className="svg" svgid={'bible.is_logo_light'} />
					) : null}
					{theme !== 'paper' || userAgent === 'ms' ? (
						<SvgWrapper
							fill={userAgent === 'ms' ? '#fff' : ''}
							className="svg"
							svgid={'bible.is_logo'}
						/>
					) : null}
				</a>
				<a>
					<FormattedMessage {...messages.ministry} />
				</a>
			</div>
			<div className={'footer-link-container'}>
				<a className={'footer-link'}>
					<FormattedMessage {...messages.audioDownload} />
				</a>
				<a className={'footer-link'}>
					<FormattedMessage {...messages.privacy} />
				</a>
				<a className={'footer-link'}>
					<FormattedMessage {...messages.terms} />
				</a>
				<a className={'footer-link'}>
					<FormattedMessage {...messages.radio} />
				</a>
				<a className={'footer-link'}>
					<FormattedMessage {...messages.support} />
				</a>
			</div>
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
	scrolledToBottom: PropTypes.bool,
	theme: PropTypes.string,
	userAgent: PropTypes.string,
};

export default Footer;
