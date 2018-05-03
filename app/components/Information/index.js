/**
*
* Information
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import CloseMenuFunctions from 'utils/closeMenuFunctions';

class Information extends React.PureComponent {// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.ref, this.props.toggleInformationModal);
		this.closeMenuController.onMenuMount();
		this.props.getCopyrights({
			filesetIds: [
				this.props.audioFilesetId,
				this.props.plainTextFilesetId,
				this.props.formattedTextFilesetId,
			],
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
		return (
			<aside ref={this.setRef} className="profile">
				<header>
					<h1 className="section-title">Information</h1>
					<SvgWrapper className={'icon'} svgid={'info'} onClick={() => toggleInformationModal()} />
					<SvgWrapper className={'icon'} svgid={'arrow_left'} onClick={() => toggleInformationModal()} />
				</header>
				<section className="copyrights-section">
					{
						copyrights.map((cp, i) => <p className={'text'} key={`${cp.message.slice(i)}_copyright`}>{cp.message}</p>)
					}
				</section>
			</aside>
		);
	}
}

Information.propTypes = {
	toggleInformationModal: PropTypes.func,
	getCopyrights: PropTypes.func,
	copyrights: PropTypes.array,
	audioFilesetId: PropTypes.string,
	plainTextFilesetId: PropTypes.string,
	formattedTextFilesetId: PropTypes.string,
};

export default Information;
