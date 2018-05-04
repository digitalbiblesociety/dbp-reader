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
								copyrights.oldTestament.audio.organizations.map((org) => (
									<h3><FormattedMessage {...messages.providedByAudio} />&nbsp;<a href={org.url}>{org.name}</a>
										<br />
										<img alt={'Copyright owners logo'} src={org.logo.url} height={'40px'} width={'40px'} />
									</h3>
								))
							}
							<p>{copyrights.oldTestament.audio.message}</p>
						</div>
						<div className={'cp-section'}>
							{
								copyrights.oldTestament.text.organizations.map((org) => (
									<h3><FormattedMessage {...messages.providedByText} />&nbsp;<a href={org.url}>{org.name}</a>
										<br />
										<img alt={'Copyright owners logo'} src={org.logo.url} height={'40px'} width={'40px'} />
									</h3>
								))
							}
							<p>{copyrights.oldTestament.text.message}</p>
						</div>
					</div>
					<div className={'nt-copyright'}>
						<h1>New Testament</h1>
						<div className={'cp-section'}>
							{
								copyrights.newTestament.audio.organizations.map((org) => (
									<h3><FormattedMessage {...messages.providedByAudio} />&nbsp;<a href={org.url}>{org.name}</a>
										<br />
										<img alt={'Copyright owners logo'} src={org.logo.url} height={'40px'} width={'40px'} />
									</h3>
								))
							}
							<p>{copyrights.newTestament.audio.message}</p>
						</div>
						<div className={'cp-section'}>
							{
								copyrights.newTestament.text.organizations.map((org) => (
									<h3><FormattedMessage {...messages.providedByText} />&nbsp;<a href={org.url}>{org.name}</a>
										<br />
										<img alt={'Copyright owners logo'} src={org.logo.url} height={'40px'} width={'40px'} />
									</h3>
								))
							}
							<p>{copyrights.newTestament.text.message}</p>
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
