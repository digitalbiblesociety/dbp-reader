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
import SvgWrapper from 'components/SvgWrapper';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
import makeSelectSearchContainer from './selectors';
import reducer from './reducer';
import saga from './saga';

export class SearchContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.ref, this.props.toggleSearchModal);
		this.closeMenuController.onMenuMount();
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setRef = (node) => {
		this.ref = node;
	}

	handleSearchModalToggle = () => {
		document.removeEventListener('click', this.handleClickOutside);

		this.props.toggleSearchModal();
	}

	render() {
		return (
			<GenericErrorBoundary affectedArea="Search">
				<aside ref={this.setRef} className="search">
					<header>
						<h1 className="section-title">Search</h1>
						<SvgWrapper className={'icon'} svgid={'search'} />
						<SvgWrapper onClick={this.handleSearchModalToggle} className={'icon'} svgid={'arrow_left'} />
					</header>
				</aside>
			</GenericErrorBoundary>
		);
	}
}

SearchContainer.propTypes = {
	toggleSearchModal: PropTypes.func.isRequired,
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
