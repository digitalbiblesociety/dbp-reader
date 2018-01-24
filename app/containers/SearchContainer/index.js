/**
 *
 * SearchContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import menu from 'images/menu.svg';
import makeSelectSearchContainer from './selectors';
import reducer from './reducer';
import saga from './saga';

export class SearchContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
	}

	setRef = (node) => {
		this.ref = node;
	}

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleSearchContainer();
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	handleSearchContainerToggle = () => {
		document.removeEventListener('click', this.handleClickOutside);

		this.props.toggleSearchContainer();
	}

	render() {
		return (
			<GenericErrorBoundary affectedArea="Search">
				<aside ref={this.setRef} className="settings">
					<header>
						<h2 className="section-title">Search</h2>
						<span role="button" tabIndex={0} className="close-icon" onClick={this.handleSearchContainerToggle}>
							<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
						</span>
					</header>
				</aside>
			</GenericErrorBoundary>
		);
	}
}

SearchContainer.propTypes = {
	toggleSearchContainer: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
	searchcontainer: makeSelectSearchContainer(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'searchContainer', reducer });
const withSaga = injectSaga({ key: 'searchContainer', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(SearchContainer);
