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
import LoadingSpinner from 'components/LoadingSpinner';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
import { getSearchResults } from './actions';
import makeSelectSearchContainer from './selectors';
import reducer from './reducer';
import saga from './saga';

export class SearchContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		filterText: '',
	}

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

	getSearchResults = (props) => this.props.dispatch(getSearchResults(props))

	handleSearchModalToggle = () => {
		// document.removeEventListener('click', this.handleClickOutside);

		this.props.toggleSearchModal();
	}

	handleSearchInputChange = (e) => {
		const val = e.target.value;
		const { bibleId } = this.props;

		this.setState({ filterText: val });
		// Clears the timeout so that at most there will only be one request per second
		if (this.timer) {
			clearTimeout(this.timer);
		}
		// Don't have to bind 'this' bc of the arrow function
		this.timer = setTimeout(() => {
			if (!val) {
				return;
			}
			this.getSearchResults({ bibleId, searchText: val });
		}, 1000);
	}

	render() {
		const { filterText } = this.state;
		const { searchResults, loadingResults } = this.props.searchcontainer;

		return (
			<GenericErrorBoundary affectedArea="Search">
				<aside ref={this.setRef} className="search">
					<header>
						<h1 className="section-title">Search</h1>
						<SvgWrapper className={'icon'} svgid={'search'} />
						<SvgWrapper onClick={this.handleSearchModalToggle} className={'icon'} svgid={'arrow_left'} />
					</header>
					<div className={'search-input-bar'}>
						<SvgWrapper className={'icon'} svgid={'search'} />
						<input
							onChange={this.handleSearchInputChange}
							value={filterText}
							className={'input-class'}
							placeholder={'Search'}
						/>
					</div>
					{
						loadingResults ? <LoadingSpinner /> : (
							<div className={'search-results'}>
								<h2>Search Results</h2>
								{
									searchResults.length ? searchResults.map((result) => (
										<div key={`${result.book_id}${result.chapter}${result.verse_start}`} className={'single-result'}>
											<h4>{`${result.book_name_alt} ${result.chapter_alt}:${result.verse_start_alt}`}</h4>
											<p>{result.verse_text}</p>
										</div>
									)) : <div>There were no matches for your search</div>
								}
							</div>
						)
					}
				</aside>
			</GenericErrorBoundary>
		);
	}
}

SearchContainer.propTypes = {
	dispatch: PropTypes.func.isRequired,
	toggleSearchModal: PropTypes.func.isRequired,
	bibleId: PropTypes.string,
	searchcontainer: PropTypes.object,
	loadingResults: PropTypes.bool,
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
