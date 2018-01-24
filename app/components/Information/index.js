/**
*
* Information
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import menu from 'images/menu.svg';
// import styled from 'styled-components';

class Information extends React.PureComponent {// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		if (document.onclick) {
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	setRef = (node) => {
		this.ref = node;
	}

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleInformationModal();
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	render() {
		const {
			copywrite,
		} = this.props;
		return (
			<aside ref={this.setRef} className="settings">
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
