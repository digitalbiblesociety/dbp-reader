/**
 *
 * Information
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import AnimateHeight from 'react-animate-height';
import { selectCopyrights } from './selectors';
import ImageComponent from '../ImageComponent';
import messages from './messages';
import SvgWrapper from '../SvgWrapper';

class Information extends React.PureComponent {
	state = {
		opened: false,
		height: 0,
	};
	// eslint-disable-line react/prefer-stateless-function
	setRef = (node) => {
		this.ref = node;
	};

	getAudioCopyright = (organizations, testament) =>
		organizations.map((org) => [
			<h3 key={`${org.name}_audio_name_${testament}`}>
				<FormattedMessage {...messages.providedByAudio} />
			</h3>,
			org.logo ? (
				<a
					rel={'noopener'}
					key={`${org.url}_audio_url_${testament}`}
					target={'_blank'}
					href={org.url}
				>
					<ImageComponent
						className={
							org.isIcon
								? 'image-icon fcbh-copyright-logo'
								: 'image-landscape fcbh-copyright-logo'
						}
						alt={`Copyright owners logo: ${org.name}`}
						src={org.logo.url}
					/>
				</a>
			) : (
				<a
					rel={'noopener'}
					className={org.url ? 'org-name link' : 'org-name'}
					key={`${org.url}_audio_${testament}`}
					target={'_blank'}
					href={org.url}
				>
					{org.name}
				</a>
			),
		]);
	getTextCopyright = (organizations, testament) =>
		organizations.map((org) => [
			<h3 key={`${org.name}_text_name_${testament}`}>
				<FormattedMessage {...messages.providedByText} />
			</h3>,
			org.logo ? (
				<a
					rel={'noopener'}
					key={`${org.url}_text_url_${testament}`}
					target={'_blank'}
					href={org.url}
				>
					<ImageComponent
						className={org.isIcon ? 'image-icon' : 'image-landscape'}
						alt={`Copyright owners logo: ${org.name}`}
						src={org.logo.url}
					/>
				</a>
			) : (
				<a
					rel={'noopener'}
					className={org.url ? 'org-name link' : 'org-name'}
					key={`${org.url}_text_${testament}`}
					target={'_blank'}
					href={org.url}
				>
					{org.name}
				</a>
			),
		]);
	// {
	// 	copyrights.map((c) => c.organizations.map((o) => (
	// <div key={`${o.name}_${o.url}`}>
	// <h3>Provided to you by <a// 						rel={'noopener'}href={o.url}>{o.name}</a></h3>
	// <p>{c.message}</p>
	// </div>
	// )))
	// }
	toggleCopyright = () => {
		this.setState((currentState) => ({
			opened: !currentState.opened,
			height: !currentState.height ? 520 : 0,
		}));
	};

	render() {
		const {
			copyrights,
			// toggleInformationModal,
		} = this.props;

		// console.log('copyrights information render', copyrights);
		return (
			<section ref={this.setRef} className="information">
				<button onClick={this.toggleCopyright} className="information-toggle">
					<FormattedMessage {...messages.material} />
					&nbsp;|&nbsp;
					<span className={'learn-more'}>
						<FormattedMessage {...messages.learnMore} />
					</span>
					<SvgWrapper
						className={this.state.opened ? 'icon rotate' : 'icon'}
						svgid={'arrow_down'}
					/>
				</button>
				<AnimateHeight height={this.state.height} duration={1000}>
					<div className="copyrights-section">
						<div className={'ot-copyright'}>
							{/* <div className={'cp-header'}><h1>Old Testament</h1></div> */}
							{get(copyrights, ['oldTestament', 'audio', 'organizations']) ||
							get(copyrights, ['oldTestament', 'audio', 'message']) ? (
								<div className={'cp-section'}>
									{get(copyrights, ['oldTestament', 'audio', 'organizations'])
										? this.getAudioCopyright(
												get(copyrights, [
													'oldTestament',
													'audio',
													'organizations',
												]),
												'old_testament',
										  )
										: null}
									{get(copyrights, ['oldTestament', 'audio', 'message']) ? (
										<p>{copyrights.oldTestament.audio.message}</p>
									) : null}
								</div>
							) : null}
							{get(copyrights, ['oldTestament', 'text', 'organizations']) ||
							get(copyrights, ['oldTestament', 'text', 'message']) ? (
								<div className={'cp-section'}>
									{get(copyrights, ['oldTestament', 'text', 'organizations'])
										? this.getTextCopyright(
												get(copyrights, [
													'oldTestament',
													'text',
													'organizations',
												]),
												'old_testament',
										  )
										: null}
									{get(copyrights, ['oldTestament', 'text', 'message']) ? (
										<p>{copyrights.oldTestament.text.message}</p>
									) : null}
								</div>
							) : null}
						</div>
						<div className={'nt-copyright'}>
							{/* <div className={'cp-header'}><h1>New Testament</h1></div> */}
							{get(copyrights, ['newTestament', 'audio', 'organizations']) ||
							get(copyrights, ['newTestament', 'audio', 'message']) ? (
								<div className={'cp-section'}>
									{get(copyrights, ['newTestament', 'audio', 'organizations'])
										? this.getAudioCopyright(
												get(copyrights, [
													'newTestament',
													'audio',
													'organizations',
												]),
												'new_testament',
										  )
										: null}
									{get(copyrights, ['newTestament', 'audio', 'message']) ? (
										<p>{copyrights.newTestament.audio.message}</p>
									) : null}
								</div>
							) : null}
							{get(copyrights, ['newTestament', 'text', 'organizations']) ||
							get(copyrights, ['newTestament', 'text', 'message']) ? (
								<div className={'cp-section'}>
									{get(copyrights, ['newTestament', 'text', 'organizations'])
										? this.getTextCopyright(
												get(copyrights, [
													'newTestament',
													'text',
													'organizations',
												]),
												'new_testament',
										  )
										: null}
									{get(copyrights, ['newTestament', 'text', 'message']) ? (
										<p>{copyrights.newTestament.text.message}</p>
									) : null}
								</div>
							) : null}
						</div>
					</div>
				</AnimateHeight>
				<div className={'ministry-statement'}>
					<FormattedMessage {...messages.circleC} />&nbsp;
					<a rel={'noopener'} target={'_blank'} href={'http://www.bible.is'}>
						<FormattedMessage {...messages.bibleIsText} />
					</a>
					<FormattedMessage {...messages.ministrySlogan} />&nbsp;
					<a
						rel={'noopener'}
						target={'_blank'}
						href={'https://www.faithcomesbyhearing.com'}
					>
						<FormattedMessage {...messages.faithComesByHearing} />
					</a>
					&nbsp;<FormattedMessage {...messages.circleR} />
				</div>
			</section>
		);
	}
}

Information.propTypes = {
	copyrights: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	copyrights: selectCopyrights(),
});

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(Information);
