/**
*
* Information
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import menu from 'images/menu.svg';
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

	render() {
		const {
			copywrite,
		} = this.props;
		return (
			<aside ref={this.setRef} className="menu-sidebar settings">
				<header>
					<h2 className="section-title">Information</h2>
					<span role="button" tabIndex={0} className="close-icon" onClick={this.props.toggleInformationModal}>
						<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
					</span>
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
	copywrite: PropTypes.object,
};

export default Information;
