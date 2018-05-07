/**
*
* Information
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import messages from './messages';

class Information extends React.PureComponent {// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.ref, this.props.toggleInformationModal);
		this.closeMenuController.onMenuMount();
		this.props.getCopyrights({
			filesetIds: this.props.activeFilesets,
			// filesetIds: [
			// 	this.props.audioFilesetId,
			// 	this.props.plainTextFilesetId,
			// 	this.props.formattedTextFilesetId,
			// ],
			// filesetIds: [
			// 	'ENGNIVC2DA',
			// 	'ENGNIV',
			// ],
		});
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setRef = (node) => {
		this.ref = node;
	}

	getAudioCopyright = (organizations) => organizations.map((org) => (
		<h3 key={org.name}><FormattedMessage {...messages.providedByAudio} />&nbsp;<a href={org.url}>{org.name}</a>
			<br />
			{
				org.logo ? <img alt={'Copyright owners logo'} src={org.logo.url} height={'40px'} width={'40px'} /> : null
			}
		</h3>
	));
	getTextCopyright = (organizations) => organizations.map((org) => (
		<h3 key={org.name}><FormattedMessage {...messages.providedByText} />&nbsp;<a href={org.url}>{org.name}</a>
			<br />
			{
				org.logo ? <img alt={'Copyright owners logo'} src={org.logo.url} height={'40px'} width={'40px'} /> : null
			}
		</h3>
	));
// {
// 	copyrights.map((c) => c.organizations.map((o) => (
// <div key={`${o.name}_${o.url}`}>
// <h3>Provided to you by <a href={o.url}>{o.name}</a></h3>
// <p>{c.message}</p>
// </div>
// )))
// }
	render() {
		const {
			copyrights,
			toggleInformationModal,
		} = this.props;

		// console.log('copyrights information render', copyrights);
		return (
			<aside ref={this.setRef} className="profile">
				<header>
					<h1 className="section-title">Information</h1>
					<SvgWrapper className={'icon'} svgid={'info'} onClick={() => toggleInformationModal()} />
					<SvgWrapper className={'icon'} svgid={'arrow_left'} onClick={() => toggleInformationModal()} />
				</header>
				<section className="copyrights-section">
					<div className={'ot-copyright'}>
						<h1>Old Testament</h1>
						<div className={'cp-section'}>
							{
								get(copyrights, ['oldTestament', 'audio', 'organizations']) ?
									this.getAudioCopyright(get(copyrights, ['oldTestament', 'audio', 'organizations'])) :
									null
							}
							{
								get(copyrights, ['oldTestament', 'audio', 'message']) ?
									<p>{copyrights.oldTestament.audio.message}</p> : null
							}
						</div>
						<div className={'cp-section'}>
							{
								get(copyrights, ['oldTestament', 'text', 'organizations']) ?
									this.getTextCopyright(get(copyrights, ['oldTestament', 'text', 'organizations'])) :
									null
							}
							{
								get(copyrights, ['oldTestament', 'text', 'message']) ?
									<p>{copyrights.oldTestament.text.message}</p> : null
							}
						</div>
					</div>
					<div className={'nt-copyright'}>
						<h1>New Testament</h1>
						<div className={'cp-section'}>
							{
								get(copyrights, ['newTestament', 'audio', 'organizations']) ?
									this.getAudioCopyright(get(copyrights, ['newTestament', 'audio', 'organizations'])) :
									null
							}
							{
								get(copyrights, ['newTestament', 'audio', 'message']) ?
									<p>{copyrights.newTestament.audio.message}</p> : null
							}
						</div>
						<div className={'cp-section'}>
							{
								get(copyrights, ['newTestament', 'text', 'organizations']) ?
									this.getTextCopyright(get(copyrights, ['newTestament', 'text', 'organizations'])) :
									null
							}
							{
								get(copyrights, ['newTestament', 'text', 'message']) ?
									<p>{copyrights.newTestament.text.message}</p> : null
							}
						</div>
					</div>
				</section>
			</aside>
		);
	}
}

Information.propTypes = {
	toggleInformationModal: PropTypes.func,
	getCopyrights: PropTypes.func,
	copyrights: PropTypes.object,
	// audioFilesetId: PropTypes.string,
	// plainTextFilesetId: PropTypes.string,
	// formattedTextFilesetId: PropTypes.string,
	activeFilesets: PropTypes.array,
};

export default Information;
