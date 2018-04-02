/**
*
* Information
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
// import styled from 'styled-components';

class Information extends React.PureComponent {// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.ref, this.props.toggleInformationModal);
		this.closeMenuController.onMenuMount();
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setRef = (node) => {
		this.ref = node;
	}

	toggleInformation = () => {
		if (!this.props.active) {
			this.props.toggleInformationModal();
		}
	}

	render() {
		const {
			copywrite,
		} = this.props;
		return (
			<aside ref={this.setRef} className="settings">
				<header>
					<SvgWrapper className={'icon'} svgid={'arrow_right'} />
					<SvgWrapper className={'icon'} onClick={this.toggleInformation} svgid={'info'} />
					<h1 className="section-title">Information</h1>
				</header>
				<section className="copywrite">
					<h1 className="text">{copywrite.name}</h1>
					<h1 className="text">{copywrite.mark}</h1>
					<h1 className="text">{copywrite.date}</h1>
					<h1 className="text">{copywrite.country}</h1>
				</section>
			</aside>
		);
	}
}

Information.propTypes = {
	toggleInformationModal: PropTypes.func,
	active: PropTypes.bool,
	copywrite: PropTypes.object,
};

export default Information;
