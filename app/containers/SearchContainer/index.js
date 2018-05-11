/**
 *
 * SearchContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import SvgWrapper from 'components/SvgWrapper';
import LoadingSpinner from 'components/LoadingSpinner';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
import SearchResult from 'components/SearchResult';
import RecentSearches from 'components/RecentSearches';
import { getSearchResults, viewError, stopLoading, startLoading } from './actions';
import makeSelectSearchContainer, { selectSearchResults } from './selectors';
import reducer from './reducer';
import saga from './saga';

export class SearchContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		filterText: '',
		firstSearch: true,
	}

	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.ref, this.props.toggleSearchModal);
		this.closeMenuController.onMenuMount();
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
		this.props.dispatch(viewError());
		this.props.dispatch(stopLoading());
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
		const { bibleId, loadingResults } = this.props;

		this.setState({ filterText: val, firstSearch: !val });
		// May want to not control the loading state with redux and just use setState instead
		if (!loadingResults && val) {
			this.props.dispatch(startLoading());
		} else if (!val) {
			this.props.dispatch(stopLoading());
		}
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
			this.setState({ firstSearch: false });
		}, 1000);
	}

	handleSearchOptionClick = (filterText) => {
		const bibleId = this.props.bibleId;

		this.setState({ filterText });

		if (this.timer) {
			clearTimeout(this.timer);
		}

		this.timer = setTimeout(() => {
			if (!filterText) {
				return;
			}
			this.getSearchResults({ bibleId, searchText: filterText });
			this.setState({ firstSearch: false });
		}, 1000);
	}

	get formattedResults() {
		const {
			// searchResults,
			showError,
			trySearchOptions,
			lastFiveSearches,
			loadingResults,
		} = this.props.searchcontainer;
		const { bibleId, searchResults } = this.props;
		// console.log('selectedRes', searchResults);
		const { firstSearch } = this.state;

		if (firstSearch) {
			return (
				<div className={'search-results'}>
					<h2>Need a place to start?<br />Try Searching:</h2>
					{
						trySearchOptions.map((o) => [<br key={`br${o.searchText}`} />, <button key={o.id} className={'search-history-item'} onClick={() => this.handleSearchOptionClick(o.searchText)}>{o.searchText}</button>])
					}
					<br />
					<h2>Search History:</h2>
					<RecentSearches searches={lastFiveSearches} clickHandler={this.handleSearchOptionClick} />
				</div>
			);
		}

		if (loadingResults) {
			return <LoadingSpinner />;
		}

		return (
			<div className={'search-results'}>
				{
					(searchResults.size && !showError) ?
						searchResults.toIndexedSeq().map((res) => (
							<div className={'book-result-section'} key={res.get('name')}>
								<div className={'header'}><h1>{res.get('name')}</h1></div>
								{
									res.get('results')
										.map((r) => <SearchResult bibleId={bibleId} key={`${r.get('book_id')}${r.get('chapter')}${r.get('verse_start')}`} result={r} />)
								}
							</div>
						)) :
						<div>There were no matches for your search</div>
				}
			</div>
		);
	}

	render() {
		const { filterText } = this.state;
		const { loadingResults } = this.props.searchcontainer;
		// console.log('last five', this.props.searchcontainer.lastFiveSearches);
		// Need a good method of telling whether there are no results because a user hasn't searched
		// or if it was because this was the first visit to the tab
		return (
			<GenericErrorBoundary affectedArea="Search">
				<aside ref={this.setRef} className="search">
					<header>
						<h1 className="section-title">Search</h1>
						<SvgWrapper onClick={this.handleSearchModalToggle} className={'icon'} svgid={'search'} />
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
						loadingResults ? <LoadingSpinner /> : this.formattedResults
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
	searchResults: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	searchcontainer: makeSelectSearchContainer(),
	searchResults: selectSearchResults(),
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
