/**
*
* Information
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import ImageComponent from 'components/ImageComponent';
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

	getAudioCopyright = (organizations, testament) => organizations.map((org) => (
		[
			<h3 key={`${org.name}_audio_${testament}`}><FormattedMessage {...messages.providedByAudio} /></h3>,
			org.logo ? <a key={`${org.url}_audio_${testament}`} target={'_blank'} href={org.url}><ImageComponent className={org.isIcon ? 'image-icon' : 'image-langscape'} alt={'Copyright owners logo'} src={org.logo.url} /></a> : <a className={org.url ? 'org-name link' : 'org-name'} key={`${org.url}_audio_${testament}`} target={'_blank'} href={org.url}>{org.name}</a>,
		]
	));
	getTextCopyright = (organizations, testament) => organizations.map((org) => (
		[
			<h3 key={`${org.name}_text_${testament}`}><FormattedMessage {...messages.providedByText} /></h3>,
			org.logo ? <a key={`${org.url}_text_${testament}`} target={'_blank'} href={org.url}><ImageComponent className={org.isIcon ? 'image-icon' : 'image-langscape'} alt={'Copyright owners logo'} src={org.logo.url} /></a> : <a className={org.url ? 'org-name link' : 'org-name'} key={`${org.url}_text_${testament}`} target={'_blank'} href={org.url}>{org.name}</a>,
		]
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
					<SvgWrapper style={{ marginTop: '5px' }} className={'icon'} svgid={'info'} onClick={() => toggleInformationModal()} />
					<h1 className="section-title">Copyright Information</h1>
					<SvgWrapper className={'icon'} svgid={'arrow_left'} onClick={() => toggleInformationModal()} />
				</header>
				<div className="copyrights-section">
					<div className={'ot-copyright'}>
						<div className={'cp-header'}><h1>Old Testament</h1></div>
						{
							get(copyrights, ['oldTestament', 'audio', 'organizations']) ||
							get(copyrights, ['oldTestament', 'audio', 'message']) ?
								<div className={'cp-section'}>
									{
										get(copyrights, ['oldTestament', 'audio', 'organizations']) ?
											this.getAudioCopyright(get(copyrights, ['oldTestament', 'audio', 'organizations']), 'old_testament') :
											null
									}
									{
										get(copyrights, ['oldTestament', 'audio', 'message']) ?
											<p>{copyrights.oldTestament.audio.message}</p> : null
									}
								</div> :
								null
						}
						{
							get(copyrights, ['oldTestament', 'text', 'organizations']) ||
							get(copyrights, ['oldTestament', 'text', 'message']) ?
								<div className={'cp-section'}>
									{
										get(copyrights, ['oldTestament', 'text', 'organizations']) ?
											this.getTextCopyright(get(copyrights, ['oldTestament', 'text', 'organizations']), 'old_testament') :
											null
									}
									{
										get(copyrights, ['oldTestament', 'text', 'message']) ?
											<p>{copyrights.oldTestament.text.message}</p> : null
									}
								</div> :
								null
						}
					</div>
					<div className={'nt-copyright'}>
						<div className={'cp-header'}><h1>New Testament</h1></div>
						{
							get(copyrights, ['newTestament', 'audio', 'organizations']) ||
							get(copyrights, ['newTestament', 'audio', 'message']) ?
								<div className={'cp-section'}>
									{
										get(copyrights, ['newTestament', 'audio', 'organizations']) ?
											this.getAudioCopyright(get(copyrights, ['newTestament', 'audio', 'organizations']), 'new_testament') :
											null
									}
									{
										get(copyrights, ['newTestament', 'audio', 'message']) ?
											<p>{copyrights.newTestament.audio.message}</p> : null
									}
								</div> :
								null
						}
						{
							get(copyrights, ['newTestament', 'text', 'organizations']) ||
							get(copyrights, ['newTestament', 'text', 'message']) ?
								<div className={'cp-section'}>
									{
										get(copyrights, ['newTestament', 'text', 'organizations']) ?
											this.getTextCopyright(get(copyrights, ['newTestament', 'text', 'organizations']), 'new_testament') :
											null
									}
									{
										get(copyrights, ['newTestament', 'text', 'message']) ?
											<p>{copyrights.newTestament.text.message}</p> : null
									}
								</div> :
								null
						}
					</div>
				</div>
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
