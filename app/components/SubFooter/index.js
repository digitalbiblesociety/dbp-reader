/**
 *
 * SubFooter
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SvgWrapper from '../SvgWrapper';
import messages from './messages';

class SubFooter extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	render() {
		const { theme, userAgent } = this.props;
		return (
			<div className={'footer-about-content'}>
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
					<a
						className={'logo-text'}
						href={'http://www.bible.is'}
						title={'http://www.bible.is'}
						target={'_blank'}
						rel={'noopener'}
					>
						<FormattedMessage {...messages.ministry} />
					</a>
				</div>
				<div className={'footer-link-container'}>
					<a
						className={'footer-link'}
						href={'http://www.bible.is/download/audio'}
						title={'http://www.bible.is/download/audio'}
						target={'_blank'}
						rel={'noopener'}
					>
						<FormattedMessage {...messages.audioDownload} />
					</a>
					<a
						className={'footer-link'}
						href={'http://www.bible.is/privacy'}
						title={'http://www.bible.is/privacy'}
						target={'_blank'}
						rel={'noopener'}
					>
						<FormattedMessage {...messages.privacy} />
					</a>
					<a
						className={'footer-link'}
						href={'http://www.bible.is/terms'}
						title={'http://www.bible.is/terms'}
						target={'_blank'}
						rel={'noopener'}
					>
						<FormattedMessage {...messages.terms} />
					</a>
					<a
						className={'footer-link'}
						href={'http://www.bible.is/radio'}
						title={'http://www.bible.is/radio'}
						target={'_blank'}
						rel={'noopener'}
					>
						<FormattedMessage {...messages.radio} />
					</a>
					<a
						className={'footer-link'}
						href={'http://www.bible.is/contact'}
						title={'http://www.bible.is/contact'}
						target={'_blank'}
						rel={'noopener'}
					>
						<FormattedMessage {...messages.support} />
					</a>
				</div>
			</div>
		);
	}
}

SubFooter.propTypes = {
	// scrolledToBottom: PropTypes.bool,
	theme: PropTypes.string,
	userAgent: PropTypes.string,
};

export default SubFooter;
